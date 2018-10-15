'use strict'

const {EventRegisterCompletedEvent} = require('../../enum/mq-event-publish-enum')

module.exports = class EventRegisterCompletedEventHandler {

    constructor(app) {
        this.app = app
    }

    /**
     * 事件注册完成处理
     */
    async handle(eventInfo, eventName) {
        this.app.rabbitClient.publish(Object.assign({}, EventRegisterCompletedEvent, {
            eventName, body: eventInfo.callbackParams
        })).callback(error => this.callback(error, eventInfo))
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("sign-presentable-event-trigger-handler", '事件执行异常', ...arguments)
            this.app.logger.error("sign-presentable-event-trigger-handler", '事件执行异常', ...arguments)
        }
    }
}