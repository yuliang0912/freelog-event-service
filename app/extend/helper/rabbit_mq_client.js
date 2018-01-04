/**
 * Created by yuliang on 2017/9/6.
 */

'use strict'

let instance = null
const amqp = require('amqp')
const uuid = require('node-uuid')
const Emitter = require('events')
const Promise = require("bluebird")

module.exports = class rabbitMqClient extends Emitter {
    constructor(rabbitConfig) {
        if (instance) {
            return instance
        }
        if (!rabbitConfig) {
            throw new Error("未找到RabbitMQ配置项")
        }
        super()
        this.config = rabbitConfig
        this.isReady = false
        this.exchange = null
        this.connection = null
        this.queues = new Map()
        this.awitSubscribes = new Map()
        this.instance = instance = this
    }

    /**
     * 开始尝试连接到rabbitmq服务端
     * @param timeout <ms>
     * @returns {*}
     */
    connect(timeout = 3000) {
        //如果已经连接OK或者之前已经创建过链接.则直接返回.保持单例
        if (this.isReady || this.connection) {
            return Promise.resolve(this.instance)
        }
        return startConnect.call(this).tap(heartBeat).timeout(timeout).catch(Promise.TimeoutError, (err) => {
            return Promise.reject(new Error('rabbitMQ connect timeout'))
        })
    }

    /**
     * 发送消息
     * @param routingKey
     * @param body
     * @param options
     */
    publish({routingKey, eventName, body, options}) {
        return new Promise((resolve, reject) => {
            if (!this.isReady) {
                return reject(new Error("rabbitMq is not ready"))
            }
            this.exchange.publish(routingKey, body || {}, Object.assign({
                mandatory: true, //无法匹配路由时,是否触发basic-return事件
                deliveryMode: 2,  //1.非持久化  2.持久化消息
                headers: {eventName: eventName || 'defalutEventName'},
                messageId: uuid.v4()
            }, options), (ret, err) => {
                if (err) {
                    this.emit('publishFaile', routingKey, body, options, this.config.exchange.name)
                    return reject(err)
                }
                resolve(!ret)
            })
        }).timeout(10000).catch(Promise.TimeoutError, (err) => {
            this.emit('publishTimeout', routingKey, body, options, this.config.exchange.name)
            return Promise.reject(new Error('消息发送已超时'))
        })
    }

    /**
     * 订阅消息
     * @param queueName
     * @param callback
     */
    subscribe(queueName, callback) {
        if (!Array.isArray(this.config.queues) || this.config.queues.length === 0) {
            throw new Error("当前exchange上没有队列,请查看配置文件")
        }
        if (!this.config.queues.some(t => t.name === queueName)) {
            throw new Error("当前exchange上不存在指定的队列名")
        }

        if (toString.call(callback) !== '[object Function]') {
            throw new Error('callback 必须是function')
        }

        /**
         * 如果已经绑定好队列,则直接订阅
         * 如果没有绑定好队列,则先临时缓存,等待队列绑定完毕,自动订阅
         */
        if (this.queues.has(queueName)) {
            this.queues.get(queueName).queue.subscribe({ack: true}, callback).addCallback(ok => {
                this.queues.get(queueName).consumerTag = ok.consumerTag
            })
            this.awitSubscribes.delete(queueName)
            console.log(queueName + '订阅成功')
        } else if (!this.awitSubscribes.has(queueName)) {
            this.awitSubscribes.set(queueName, callback)
        }
    }

    /**
     * 取消订阅
     * @param queueName
     */
    unsubscribe(queueName) {
        if (this.queues.has(queueName)) {
            this.queues.get(queueName).queue.unsubscribe(this.queues.get(queueName).consumerTag)
        } else {
            this.awitSubscribes.delete(queueName)
        }
        console.log(queueName + '取消订阅成功')
    }

    /**
     * 获取当前单例,方便其他地方直接通过instance调用函数
     * @returns {*}
     */
    static get Instance() {
        if (!instance) {
            throw new Error("请确保使用前已经在application中创建过rabbitmqClient")
        }
        return instance
    }
}


/**
 * 开始链接rabbitmq服务
 */
function startConnect() {
    return new Promise((resolve, reject) => {

        let connection = this.connection = amqp.createConnection(this.config.connOptions, this.config.implOptions)

        connection.on('ready', () => {
            this.exchange = connection.exchange(this.config.exchange.name, this.config.exchange.options)
            this.exchange.on('open', () => {
                this.isReady = true
                this.config.queues.forEach(item => {
                    connection.queue(item.name, item.options, (queue) => {
                        Array.isArray(item.routingKeys) && item.routingKeys.forEach(router => {
                            queue.bind(router.exchange || this.config.exchange.name, router.routingKey)
                        })
                        if (!this.queues.has(item.name)) {
                            this.queues.set(item.name, {queue, consumerTag: ""})
                        }
                        if (this.awitSubscribes.has(item.name)) {
                            this.subscribe(item.name, this.awitSubscribes.get(item.name))
                        }
                    })
                })
                resolve(this.instance)
            })
            this.exchange.on('basic-return', (args) => {
                console.log('消息发送失败,没有匹配的路由,option:{mandatory:true}设置才会出现此消息,否则默认忽略', args)
            })
            console.log(`rabbit connection open to ${this.config.connOptions.host}:${this.config.connOptions.port}`);
        })

        connection.on('close', () => {
            this.isReady = false
            console.log("rabbitMQ has closed...")
        })

        connection.on('error', (err) => {
            reject(err)
            this.isReady = false
            console.log("rabbitMQ error," + err.toString());
            console.log(this.config);
        })

        connection.on('tag.change', function (event) {
            this.queues.forEach(value => {
                if (value.consumerTag === event.oldConsumerTag) {
                    value.consumerTag = event.consumerTag
                }
            })
        });
    })
}

/**
 * 心跳检测函数
 * @param client
 */
function heartBeat(client) {
    setInterval(() => {
        client.publish({
            routingKey: 'heartBeat',
            eventName: null,
            body: {message: '心跳检测包'},
            options: {mandatory: false}
        }).then(() => {
            console.log('发送心跳包成功')
        }).catch((err) => {
            console.log('发送心跳包失败')
            console.error(err)
        })
    }, 600000)
    console.log('程序将在10分钟以后开始进行rabbit心跳保持')
}