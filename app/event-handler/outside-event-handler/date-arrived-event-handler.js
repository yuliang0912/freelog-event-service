'use strict'

const appEventEmitterEnum = require('../../enum/app-event-emitter-enum')

module.exports = class DateArrivedEventHandler {

    constructor(app) {
        this.app = app
        this.dateArrivedEventRegisterProvider = app.dal.dateArrivedEventRegisterProvider
    }

    /**
     * 外部时间到达事件处理
     */
    async handle(triggerUnixTimestamp) {
        await this.dateArrivedEventHandle({triggerUnixTimestamp})
        this.app.logger.info(`接收到时间到达事件,指定的时间为:${new Date(triggerUnixTimestamp * 1000).toISOString()}`)
    }

    /**
     * 填充队列数据
     */
    async dateArrivedEventHandle({triggerUnixTimestamp, skip = 0, limit = 2000}) {

        const triggerEvents = await this.dateArrivedEventRegisterProvider.find({
            triggerUnixTimestamp, status: 1
        }, null, {skip, limit})

        if (triggerEvents.length > 0) {
            triggerEvents.forEach(item => this.emitDateArrivedEvent(item))
        }
        if (triggerEvents.length === limit) {
            await this.dateArrivedEventHandle({triggerUnixTimestamp, skip: skip + limit, limit})
        }
    }

    /**
     * 发起时间到达事件
     */
    emitDateArrivedEvent(eventInfo) {

        const {InternalSubjectEvent, InternalChainEvent, internalSubjectEvents, internalChainEvents} = appEventEmitterEnum
        if (eventInfo.isSubjectEvent) {
            this.app.emit(InternalSubjectEvent, internalSubjectEvents.DateArrivedEvent, eventInfo)
        }
        if (eventInfo.isChainEvent) {
            this.app.emit(InternalChainEvent, internalChainEvents.DateArrivedEvent, eventInfo)
        }
    }
}