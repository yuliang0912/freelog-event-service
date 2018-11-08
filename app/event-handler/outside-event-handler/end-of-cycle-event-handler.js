'use strict'

const appEventEmitterEnum = require('../../enum/app-event-emitter-enum')
const {EndOfCycleBroadcastEvent} = require('../../enum/mq-event-publish-enum')

module.exports = class EndOfCycleEventHandler {

    constructor(app) {
        this.app = app
        this.cycleEventRegisterProvider = app.dal.cycleEventRegisterProvider
    }

    /**
     * 周期结束事件处理
     */
    async handle(cycleNumber) {
        this.app.logger.info(`接收到周期结束事件,周期号:${cycleNumber}`)
        this.sendMessageToMessageQueue(cycleNumber)
        await this.endOfCycleEventHandle({cycleNumber})
    }

    /**
     * 填充队列数据
     */
    async endOfCycleEventHandle({cycleNumber, skip = 0, limit = 2000}) {

        const condition = {cycleNumber: {$in: [0, cycleNumber]}, status: 1}
        const triggerEvents = await this.cycleEventRegisterProvider.find(condition, null, {skip, limit})

        if (triggerEvents.length > 0) {
            triggerEvents.forEach(item => this.emitEndOfCycleEvent(item))
        }
        if (triggerEvents.length === limit) {
            await this.endOfCycleEventHandle({cycleNumber, skip: skip + limit, limit})
        }
    }

    /**
     * 发送消息到消息队列
     */
    sendMessageToMessageQueue(cycleNumber) {
        this.app.rabbitClient.publish(Object.assign({}, EndOfCycleBroadcastEvent, {body: {cycleNumber}}))
    }

    /**
     * 发起周期结束主题事件
     */
    emitEndOfCycleEvent(eventInfo) {

        const {InternalSubjectEvent, InternalChainEvent, internalSubjectEvents, internalChainEvents} = appEventEmitterEnum
        if (eventInfo.isSubjectEvent) {
            this.app.emit(InternalSubjectEvent, internalSubjectEvents.EndOfCycleEvent, eventInfo)
        }
        if (eventInfo.isChainEvent) {
            this.app.emit(InternalChainEvent, internalChainEvents.EndOfCycleEvent, eventInfo)
        }
    }
}