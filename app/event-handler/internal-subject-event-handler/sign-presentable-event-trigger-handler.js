'use strict'

const queue = require('async/queue')
const {PresentableSignEvent} = require('../../enum/mq-event-publish-enum')

module.exports = class SignPresentableEventTriggerHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.signPresentableEventTriggerHandler.bind(this), 50)
    }

    async handler(eventInfo) {
        this.queue.push(eventInfo, this.callback.bind(this))
    }

    /**
     * 签约presentable事件处理
     */
    async signPresentableEventTriggerHandler(eventInfo) {
        await this.sendToMessageQueue(eventInfo).then(result => {
            eventInfo.eventTriggerSuccess()
        }).catch(error => {
            eventInfo.eventTriggerFailed()
            this.callback(error)
        })
        this.app.logger.info(`sign presentable event, subject:${eventInfo.subjectId}`)
    }

    /**
     * 发送消息到mq
     * @param contractDateArrivedEvent
     */
    async sendToMessageQueue(eventInfo) {
        const {rabbitClient} = this.app
        rabbitClient.publish(Object.assign({}, PresentableSignEvent, {body: eventInfo.callbackParams}))
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("sign-presentable-event-trigger-handler", '事件执行异常', error)
            this.app.logger.error("sign-presentable-event-trigger-handler", '事件执行异常', error)
        }
    }
}