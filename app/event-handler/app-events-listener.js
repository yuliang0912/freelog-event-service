'use strict'

const Patrun = require('patrun')
const appEventEmitterEnum = require('../enum/app-event-emitter-enum')
const OutsideEventHandler = require('./outside-event-handler/index')
const InternalChainEventHandler = require('./internal-chain-event-handler/index')
const InternalSubjectEventHandler = require('./internal-subject-event-handler/index')
const RegisterOrUnregisterEventHandler = require('./event-register-unregister-handler/index')

module.exports = class AppEventsListener {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        setImmediate(() => this.registerEventHandler())
        this.registerEventListener()
    }

    /**
     * 注册事件侦听者
     */
    registerEventListener() {

        const {OutsideEvent, InternalSubjectEvent, InternalChainEvent, RegisterOrUnregisterEvent} = appEventEmitterEnum

        this.registerEventAndHandler(OutsideEvent)
        this.registerEventAndHandler(InternalChainEvent)
        this.registerEventAndHandler(InternalSubjectEvent)
        this.registerEventAndHandler(RegisterOrUnregisterEvent)
    }

    /**
     * 注册事件以及事件处理者
     * @param eventName
     */
    registerEventAndHandler(eventName) {

        const eventHandler = this.patrun.find(this._buildPatrunKey(eventName))
        if (!eventHandler) {
            throw new Error(`尚未注册事件${eventName}的处理者`)
        }

        this.app.on(eventName, eventHandler.handle.bind(eventHandler))
    }

    /**
     * 注册事件处理者
     */
    registerEventHandler() {

        const {app, patrun} = this
        const {OutsideEvent, InternalSubjectEvent, InternalChainEvent, RegisterOrUnregisterEvent} = appEventEmitterEnum

        patrun.add(this._buildPatrunKey(OutsideEvent), new OutsideEventHandler(app))
        patrun.add(this._buildPatrunKey(InternalChainEvent), new InternalChainEventHandler(app))
        patrun.add(this._buildPatrunKey(InternalSubjectEvent), new InternalSubjectEventHandler(app))
        patrun.add(this._buildPatrunKey(RegisterOrUnregisterEvent), new RegisterOrUnregisterEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventName) {
        return {event: eventName.toString()}
    }
}