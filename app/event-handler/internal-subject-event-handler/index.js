'use strict'

const Patrun = require('patrun')
const {internalSubjectEvents} = require('../../enum/app-event-emitter-enum')
const TallyEventHandler = require('./tally-event-trigger-handler')
const EndOfCycleEventHandler = require('./end-of-cycle-event-trigger-handler')
const DateArrivedEventHandler = require('./date-arrived-event-trigger-handler')
const EventRegisterCompletedEventHandler = require('./event-register-completed-handler')

module.exports = class OutsideEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerInternalEventHandler()
    }

    /**
     * 内部具体主题事件处理入口
     * @param triggerUnixTimestamp
     */
    handle(eventName, eventInfo, ...args) {

        const {app, patrun} = this
        if (!eventInfo.isSubjectEvent) {
            eventInfo.eventTriggerFailed()
            app.logger.info(`internal-subject-event-handler:当前事件非主题事件,已被系统忽略`, eventInfo)
            return
        }

        const eventHandler = patrun.find(this._buildPatrunKey(eventName))
        if (!eventHandler) {
            eventInfo.eventTriggerFailed()
            app.logger.info(`internal-subject-event-handler:尚未注册事件${eventName}的处理函数`)
            return
        }
        eventHandler.handle(eventInfo, ...args)
    }

    /**
     * 注册外部事件处理者
     */
    registerInternalEventHandler() {

        const {app, patrun} = this
        const {DateArrivedEvent, EndOfCycleEvent, TallyEvent, RegisterCompletedEvent} = internalSubjectEvents

        patrun.add(this._buildPatrunKey(TallyEvent), new TallyEventHandler(app))
        patrun.add(this._buildPatrunKey(EndOfCycleEvent), new EndOfCycleEventHandler(app))
        patrun.add(this._buildPatrunKey(DateArrivedEvent), new DateArrivedEventHandler(app))
        patrun.add(this._buildPatrunKey(RegisterCompletedEvent), new EventRegisterCompletedEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventName) {
        return {event: eventName.toString()}
    }
}