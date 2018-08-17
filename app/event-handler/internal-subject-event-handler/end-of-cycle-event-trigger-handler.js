'use strict'

const queue = require('async/queue')
const {EndOfCycleTriggerEvent} = require('../../enum/mq-event-publish-enum')

module.exports = class EndOfCycleEventTriggerHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.endOfCycleEventHandler.bind(this), 50)
        this.cycleEventRegisterProvider = app.dal.cycleEventRegisterProvider
    }

    async handler(eventInfo) {
        this.queue.push(eventInfo, this.callback.bind(this))
    }

    /**
     * 时间到达时间处理
     * @param triggerUnixTimestamp
     * @returns {Promise<void>}
     */
    async endOfCycleEventHandler(eventInfo) {
        await this.sendToMessageQueue(eventInfo).then(result => {
            eventInfo.eventTriggerSuccess()
        }).catch(error => {
            eventInfo.eventTriggerFailed()
            this.callback(error)
        })
        this.app.logger.info(`end of cycle event, subject:${eventInfo.subjectId} cycleNumber:${eventInfo.cycleNumber} `)
    }

    /**
     * 发送消息到mq
     * @param contractDateArrivedEvent
     */
    async sendToMessageQueue(eventInfo) {
        const {rabbitClient} = this.app
        return rabbitClient.publish(Object.assign({}, EndOfCycleTriggerEvent, {body: eventInfo.callbackParams}))
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("end-of-cycle-event-handler", '事件执行异常', error)
            this.app.logger.error("end-of-cycle-event-handler", '事件执行异常', error)
        }
    }
}