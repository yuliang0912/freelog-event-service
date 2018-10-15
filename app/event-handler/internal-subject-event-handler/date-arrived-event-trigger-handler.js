'use strict'

const queue = require('async/queue')
const {DateArrivedTriggerEvent} = require('../../enum/mq-event-publish-enum')

module.exports = class DateArrivedEventTriggerHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.dateArrivedEventTriggerHandle.bind(this), 50)
    }

    async handle(eventInfo) {
        this.queue.push(eventInfo, this.callback.bind(this))
    }

    /**
     * 时间到达事件处理
     * @param triggerUnixTimestamp
     * @returns {Promise<void>}
     */
    async dateArrivedEventTriggerHandle(eventInfo) {
        await this.sendToMessageQueue(eventInfo).then(result => {
            eventInfo.eventTriggerSuccess()
        }).catch(error => {
            eventInfo.eventTriggerFailed()
            this.callback(error)
        })
        this.app.logger.info(`date arrived event, subject:${eventInfo.subjectId} triggerDate:${eventInfo.triggerDate.toISOString()} `)
    }

    /**
     * 发送消息到mq
     * @param contractDateArrivedEvent
     */
    async sendToMessageQueue(eventInfo) {
        const {rabbitClient} = this.app
        return rabbitClient.publish(Object.assign({}, DateArrivedTriggerEvent, {body: eventInfo.callbackParams}))
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("end-of-cycle-event-handler", '事件执行异常', ...arguments)
            this.app.logger.error("end-of-cycle-event-handler", '事件执行异常', ...arguments)
        }
    }
}