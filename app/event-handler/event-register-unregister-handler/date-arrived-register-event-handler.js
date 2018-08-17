/**
 * 注册时间到达事件处理
 */

'use strict'

const moment = require('moment')
const UnixTimeStartDate = new Date(1970, 1, 1)
const timerService = require('../../date-monitor-service/index')
const {OutsideEvent, outsideEvents} = require('../../enum/app-event-emitter-enum')

module.exports = class DateArrivedRegisterEventHandler {

    constructor(app) {
        this.app = app
        this.dateArrivedEventRegisterProvider = app.dal.dateArrivedEventRegisterProvider
    }

    /**
     * 事件注册处理
     */
    async registerHandler(message) {

        var {subjectId, eventRegisterNo, initiatorType, callbackParams, triggerDate} = message

        triggerDate = new Date(triggerDate)

        const triggerUnixTimestamp = Math.ceil((triggerDate - UnixTimeStartDate) / 1000)

        await this.dateArrivedEventRegisterProvider.create({
            subjectId, eventRegisterNo, initiatorType, triggerDate, triggerUnixTimestamp, callbackParams
        }).catch(error => this.errorHandler(error, message))

        this.app.logger.info(`register date arrived event, trigger date:${triggerDate.toISOString()}`)

        //如果当天24点之前,则直接加入时间监控队列
        if (triggerDate < moment({hour: 24}).toDate()) {
            timerService.addTimerTask(triggerUnixTimestamp, () => this.app.emit(OutsideEvent, outsideEvents.DateArrivedEvent, triggerUnixTimestamp))
        }
    }

    /**
     * 事件取消注册处理
     */
    async unregisterHandler(message) {
        const {eventRegisterNo, initiatorType} = message
        await this.dateArrivedEventRegisterProvider.deleteOne({eventRegisterNo, initiatorType})
            .catch(error => this.errorHandler(error, message))
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandler(error, message) {
        this.app.logger.error('date-arrived-register-event-handler事件执行异常', error, message)
    }
}