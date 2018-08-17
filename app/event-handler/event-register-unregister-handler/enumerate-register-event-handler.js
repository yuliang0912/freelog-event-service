'use strict'

module.exports = class EnumerateRegisterEventHandler {

    constructor(app) {
        this.app = app
        this.enumerateEventRegisterProvider = app.dal.enumerateEventRegisterProvider
    }

    /**
     * 事件取消注册处理
     */
    async registerHandler(message, eventType) {

        const {subjectId, eventRegisterNo, initiatorType, triggerLimit = 1, callbackParams} = message
        const model = {
            subjectId, eventType, eventRegisterNo, initiatorType, callbackParams, triggerLimit
        }

        await this.enumerateEventRegisterProvider.create(model)
            .catch(error => this.errorHandler(error, message, eventType))
    }

    /**
     * 事件取消注册处理
     */
    async unregisterHandler(message) {
        const {eventRegisterNo, initiatorType} = message
        await this.enumerateEventRegisterProvider.deleteOne({eventRegisterNo, initiatorType})
            .catch(error => this.errorHandler(error, message))
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandler(error, message, eventType) {
        this.app.logger.error('enumerate-register-event-handler事件执行异常', {error, message, eventType})
    }
}