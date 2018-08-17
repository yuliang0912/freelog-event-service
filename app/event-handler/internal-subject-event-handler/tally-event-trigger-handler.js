'use strict'

const queue = require('async/queue')
const eventTypeEnum = require('../../enum/event-type-enum')
const mqEventPublishEnum = require('../../enum/mq-event-publish-enum')

module.exports = class TallyEventTriggerHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.tallyEventTriggerHandler.bind(this), 50)
    }

    async handler(eventInfo) {
        this.queue.push(eventInfo, this.callback.bind(this))
    }

    /**
     * 签约presentable事件处理
     */
    async tallyEventTriggerHandler(eventInfo, ...args) {
        await this.sendToMessageQueue(eventInfo).then(result => {
            eventInfo.eventTriggerSuccess()
        }).catch(error => {
            eventInfo.eventTriggerFailed()
            this.callback(error)
        })
        this.app.logger.info(`trigger tally event, subject:${eventInfo.subjectId}`)
    }

    /**
     * 发送消息到mq
     * @param contractDateArrivedEvent
     */
    async sendToMessageQueue(eventInfo) {
        const {rabbitClient} = this.app
        if (eventInfo.eventType === eventTypeEnum.PresentableSignCountTallyEvent) {
            rabbitClient.publish(Object.assign({}, mqEventPublishEnum.PresentableSignCountTallyEvent, {body: eventInfo.callbackParams}))
        }
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