/**
 * 外部事件handler功能定义描述:
 * 接收外部其他系统发送过来的事件,然后把关心此事件的相关主题全部查找并且遍历通知
 */

'use strict'

const Patrun = require('patrun')
const {outsideEvents} = require('../../enum/app-event-emitter-enum')
const EndOfCycleEventHandler = require('./end-of-cycle-event-handler')
const DateArrivedEventHandler = require('./date-arrived-event-handler')
const PresentableConsumptionCountChangedEventHandler = require('./presentable-consumption-count-changed-event-handler')

module.exports = class OutsideEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerOutsideEventHandler()
    }

    /**
     * 外部事件处理入口
     * @param triggerUnixTimestamp
     */
    handle(outsideEvent, message) {
        const {app, patrun} = this
        const eventHandler = patrun.find(this._buildPatrunKey(outsideEvent))
        if (!eventHandler) {
            app.logger.info(`outside-event-handler:尚未注册事件${outsideEvent}的处理函数`)
            return
        }

        eventHandler.handle(message)
    }

    /**
     * 注册外部事件处理者
     */
    registerOutsideEventHandler() {

        const {app, patrun} = this
        const {DateArrivedEvent, EndOfCycleEvent, PresentableConsumptionCountChangedEvent} = outsideEvents

        patrun.add(this._buildPatrunKey(EndOfCycleEvent), new EndOfCycleEventHandler(app))
        patrun.add(this._buildPatrunKey(DateArrivedEvent), new DateArrivedEventHandler(app))
        patrun.add(this._buildPatrunKey(PresentableConsumptionCountChangedEvent), new PresentableConsumptionCountChangedEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventName) {
        return {event: eventName.toString()}
    }
}