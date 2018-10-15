'use strict'

const Patrun = require('patrun')
const eventTypeEnum = require('../../enum/event-type-enum')
const EndOfCycleEventHandler = require('./cycle-register-event-handler')
const TallyRegisterEventHandler = require('./tally-register-event-handler')
const DateArrivedEventHandler = require('./date-arrived-register-event-handler')
const {InternalSubjectEvent, internalSubjectEvents} = require('../../enum/app-event-emitter-enum')

module.exports = class OutsideEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerEventHandler()
    }

    /**
     * 外部事件注册/取消注册事件处理入口
     * @param triggerUnixTimestamp
     */
    async handle(eventType, registerType, message, eventName) {

        const {app, patrun} = this
        const eventHandler = patrun.find(this._buildPatrunKey(eventType))
        if (!eventHandler) {
            app.logger.info(`event-register-unregister-handler:当前事件尚未注册,已被系统忽略`, eventType)
            return
        }

        if (registerType === 'register') {
            await eventHandler.registerHandle(message, eventType, eventName).then(() => {
                this.app.emit(InternalSubjectEvent, internalSubjectEvents.RegisterCompletedEvent, message, eventName)
            })
        } else {
            await eventHandler.unregisterHandle(message, eventType, eventName)
        }
    }

    /**
     * 注册事件处理者
     */
    registerEventHandler() {

        const {app, patrun} = this
        const {EndOfCycleEvent, DateArrivedEvent, PresentableConsumptionCountTallyEvent} = eventTypeEnum

        patrun.add(this._buildPatrunKey(EndOfCycleEvent), new EndOfCycleEventHandler(app))
        patrun.add(this._buildPatrunKey(DateArrivedEvent), new DateArrivedEventHandler(app))
        patrun.add(this._buildPatrunKey(PresentableConsumptionCountTallyEvent), new TallyRegisterEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventType) {
        return {eventType}
    }
}