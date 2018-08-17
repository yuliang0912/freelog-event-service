'use strict'

const Patrun = require('patrun')
const eventTypeEnum = require('../enum/event-type-enum')
const rabbit = require('../extend/helper/rabbit-mq-client')
const {RegisterOrUnregisterEvent} = require('../enum/app-event-emitter-enum')

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
            client.subscribe('event-fsm-event-register-queue', this.handleMessage.bind(this))
            //订阅其他可能触发事件中心支持的事件的队列
            client.subscribe('event-subscribe-queue', this.handleMessage.bind(this))
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

        //注册or取消注册 endOfCycle事件
        handlerPatrun.add({registerUnRegisterEventType: 'endOfCycle'}, ({registerType, message}) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.EndOfCycleEvent, registerType, message)
        })

        //注册or取消注册 dateArrived事件
        handlerPatrun.add({registerUnRegisterEventType: 'dateArrived'}, ({registerType, message}) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.DateArrivedEvent, registerType, message)
        })

        //注册or取消注册 PresentableSignEvent事件
        handlerPatrun.add({registerUnRegisterEventType: 'PresentableSignEvent'}, ({registerType, message}) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.PresentableSignEvent, registerType, message)
        })

        //注册or取消注册 PresentableSignEvent计次统计事件
        handlerPatrun.add({registerUnRegisterEventType: 'PresentableSignCountTallyEvent'}, ({registerType, message}) => {
            this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.PresentableSignCountTallyEvent, registerType, message)
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
        eventHandler({registerType, message})
    }
}