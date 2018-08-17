'use strict'

const Patrun = require('patrun')
const eventTypeEnum = require('../../enum/event-type-enum')
const EndOfCycleEventHandler = require('./cycle-register-event-handler')
const TallyRegisterEventHandler = require('./tally-register-event-handler')
const DateArrivedEventHandler = require('./date-arrived-register-event-handler')
const EnumerateRegisterEventHandler = require('./enumerate-register-event-handler')

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
    async handler(eventType, registerType, message) {

        const {app, patrun} = this
        const eventHandler = patrun.find(this._buildPatrunKey(eventType))
        if (!eventHandler) {
            app.logger.info(`event-register-unregister-handler:当前事件尚未注册,已被系统忽略`, eventType)
            return
        }

        if (registerType === 'register') {
            await eventHandler.registerHandler(message, eventType)
        } else {
            await eventHandler.unregisterHandler(message, eventType)
        }
    }

    /**
     * 注册事件处理者
     */
    registerEventHandler() {

        const {app, patrun} = this
        const {EndOfCycleEvent, DateArrivedEvent, PresentableSignEvent, PresentableSignCountTallyEvent} = eventTypeEnum

        patrun.add(this._buildPatrunKey(EndOfCycleEvent), new EndOfCycleEventHandler(app))
        patrun.add(this._buildPatrunKey(DateArrivedEvent), new DateArrivedEventHandler(app))
        patrun.add(this._buildPatrunKey(PresentableSignEvent), new EnumerateRegisterEventHandler(app))
        patrun.add(this._buildPatrunKey(PresentableSignCountTallyEvent), new TallyRegisterEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventType) {
        return {eventType}
    }
}