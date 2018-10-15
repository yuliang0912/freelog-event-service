/**
 * cycle注册事件处理
 */

'use strict'

const cycleHelper = require('egg-freelog-base/app/extend/helper/cycle-helper')

module.exports = class CycleRegisterEventHandler {

    constructor(app) {
        this.app = app
        this.cycleEventRegisterProvider = app.dal.cycleEventRegisterProvider
    }

    /**
     * 事件注册处理
     */
    async registerHandle(message) {

        const {subjectId, eventRegisterNo, callbackParams, applyRegisterDate, cycleCount, initiatorType} = message
        const cycleNumber = cycleHelper.getCycleNumber(new Date(applyRegisterDate))
        const triggerCycleNumber = cycleNumber + cycleCount

        this.app.logger.info(`register end of cycle event, current cycleNumber:${cycleNumber}, trigger cycleNumber:${triggerCycleNumber}`)

        return await this.cycleEventRegisterProvider.create({
            subjectId, eventRegisterNo, initiatorType, callbackParams, cycleNumber: triggerCycleNumber,
        }).catch(error => this.errorHandle(error, message))
    }

    /**
     * 事件取消注册处理
     */
    async unregisterHandle(message) {
        const {eventRegisterNo, initiatorType} = message
        await this.cycleEventRegisterProvider.deleteOne({eventRegisterNo, initiatorType})
            .catch(error => this.errorHandle(error, message))
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandle(error, message) {
        this.app.logger.error('cycle-register-event-handler事件执行异常', error, message)
    }
}