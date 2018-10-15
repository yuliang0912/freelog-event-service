'use strict'

const Patrun = require('patrun')
const eventTypeEnum = require('../enum/event-type-enum')
const rabbit = require('../extend/helper/rabbit-mq-client')
const {RegisterOrUnregisterEvent, OutsideEvent, outsideEvents} = require('../enum/app-event-emitter-enum')

module.exports = class RabbitMessageQueueSubscribeHandler {

    constructor(app) {
        this.app = app
        this.rabbitClient = null
        this.handlerPatrun = Patrun()
        this.__registerEventHandler__()
        this.subscribe()
    }

    /**
     * 订阅rabbitMQ消息
     */
    subscribe() {
        new rabbit(this.app.config.rabbitMq).connect().then(client => {
            this.rabbitClient = client
            //订阅合同相关的事件注册队列
            client.subscribe('event#fsm-event-register-queue', this.handleMessage.bind(this))
            //presentable消费数量变更队列
            client.subscribe('event#presentable-consumption-count-changed-queue', this.handleMessage.bind(this))
        }).catch(console.error)
    }

    /**
     * rabbitMq事件处理主函数
     * @param message
     * @param headers
     * @param deliveryInfo
     * @param messageObject
     */
    async handleMessage(message, headers, deliveryInfo, messageObject) {
        try {
            const givenEventHandler = this.handlerPatrun.find({
                queue: deliveryInfo.queue,
                eventName: headers.eventName,
                routingKey: messageObject.routingKey
            })
            if (givenEventHandler) {
                await givenEventHandler({message, headers, deliveryInfo, messageObject})
            } else {
                console.log(`不能处理的未知事件,queueName:${deliveryInfo.queue},routingKey:${messageObject.routingKey},eventName:${headers.eventName}`)
            }
        } catch (e) {
            this.app.logger.error(`rabbitMq事件执行异常`, e)
        } finally {
            messageObject.acknowledge(false)
        }
    }

    /**
     * 注册事件处理函数
     * @private
     */
    __registerEventHandler__() {

        const {handlerPatrun} = this

        //外部注册事件
        handlerPatrun.add({routingKey: 'contract.event.register'}, ({message, headers}) => {
            this.eventRegisterOrUnregister(message, headers.eventName, 'register')
        })

        //外部取消注册事件
        handlerPatrun.add({routingKey: 'contract.event.unregister'}, ({message, headers}) => {
            this.eventRegisterOrUnregister(message, headers.eventName, 'unregister')
        })

        //presentable消费统计数据变更事件
        handlerPatrun.add({routingKey: 'statistics.presentable.consumption'}, ({message, headers}) => {
            this.app.emit(OutsideEvent, outsideEvents.PresentableConsumptionCountChangedEvent, message, headers.eventName)
        })


        //事件注册or取消注册注入
        //注册or取消注册 endOfCycle事件
        handlerPatrun.add({registerUnRegisterEventType: 'endOfCycle'}, (...args) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.EndOfCycleEvent, ...args)
        })

        //注册or取消注册 dateArrived事件
        handlerPatrun.add({registerUnRegisterEventType: 'dateArrived'}, (...args) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.DateArrivedEvent, ...args)
        })

        //注册or取消注册 PresentableSignEvent计次统计事件
        handlerPatrun.add({registerUnRegisterEventType: 'presentableConsumptionCountTallyEvent'}, (...args) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.PresentableConsumptionCountTallyEvent, ...args)
        })
    }

    /**
     * 事件注册或取消注册
     */
    eventRegisterOrUnregister(message, eventName, registerType) {

        const eventHandler = this.handlerPatrun.find({registerUnRegisterEventType: eventName})
        if (!eventHandler) {
            this.app.logger.info(`register-unregister-handler未注册${eventName}事件的处理函数`)
            return
        }
        eventHandler(registerType, message, eventName)
    }
}