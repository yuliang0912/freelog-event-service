/**
 * cycle注册事件处理
 */

'use strict'

const cycleHelper = new (require('../../cycle-timer-service/cycle-helper'))

module.exports = class CycleRegisterEventHandler {

    constructor(app) {
        this.app = app
        this.cycleEventRegisterProvider = app.dal.cycleEventRegisterProvider
    }

    /**
     * 事件注册处理
     */
    async registerHandler(message) {

        const {subjectId, eventRegisterNo, callbackParams, applyRegisterDate, cycleCount, initiatorType} = message
        const cycleNumber = cycleHelper.getCycleNumber(new Date(applyRegisterDate))
        const triggerCycleNumber = cycleNumber + cycleCount

        this.app.logger.info(`register end of cycle event, current cycleNumber:${cycleNumber}, trigger cycleNumber:${triggerCycleNumber}`)

        await this.cycleEventRegisterProvider.create({
            subjectId, eventRegisterNo, initiatorType, callbackParams, cycleNumber: triggerCycleNumber,
        }).catch(error => this.errorHandler(error, message))
    }

    /**
     * 事件取消注册处理
     */
    async unregisterHandler(message) {
        const {eventRegisterNo, initiatorType} = message
        await this.cycleEventRegisterProvider.deleteOne({eventRegisterNo, initiatorType})
            .catch(error => this.errorHandler(error, message))
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandler(error, message) {
        this.app.logger.error('cycle-register-event-handler事件执行异常', error, message)
    }
}