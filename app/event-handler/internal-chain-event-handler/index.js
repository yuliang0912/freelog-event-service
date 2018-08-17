'use strict'

const Patrun = require('patrun')
const TallyEventHandler = require('./tally-event-handler')
const ExpressionComputeEventHandler = require('./expression-compute-event-handler')
const {InternalTallyEvent, InternalExpressionEvent} = require('../../enum/event-initiator-type')

module.exports = class OutsideEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerEventHandler()
    }

    /**
     * 内部链式连锁事件处理入口
     * @param triggerUnixTimestamp
     */
    handler(eventName, eventInfo, ...args) {

        const {app, patrun} = this
        if (!eventInfo.isChainEvent) {
            eventInfo.eventTriggerFailed()
            app.logger.info(`internal-chain-event-handler:当前事件非连锁事件,已被系统忽略`, eventInfo)
            return
        }
        const eventHandler = patrun.find(this._buildPatrunKey(eventInfo.initiatorType))
        if (!eventHandler) {
            eventInfo.eventTriggerFailed()
            app.logger.info(`internal-chain-event-handler:尚未注册事件${eventName.toString()}的处理函数`)
            return
        }
        eventHandler.handler(eventName, eventInfo, ...args)
    }

    /**
     * 注册事件处理函数
     */
    registerEventHandler() {

        const {app, patrun} = this

        patrun.add(this._buildPatrunKey(InternalTallyEvent), new TallyEventHandler(app))
        patrun.add(this._buildPatrunKey(InternalExpressionEvent), new ExpressionComputeEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventInitiatorType) {
        return {eventInitiatorType}
    }
}