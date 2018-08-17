/**
 * Created by yuliang on 2017/9/25.
 */

'use strict'

const moment = require('moment')
const Subscription = require('egg').Subscription
const timerService = require('../date-monitor-service/index')
const {OutsideEvent, outsideEvents} = require('../enum/app-event-emitter-enum')

/**
 * 获取待结算合同事件数据
 * @param page
 * @returns {*}
 */
module.exports = class EndOfCycleTask extends Subscription {

    static get schedule() {
        return {
            type: 'worker',
            immediate: true, //启动后立即执行一次
            cron: '0 0 0 */1 * * *', //0点开始每1天执行一次
        }
    }

    async subscribe() {

        const {dateArrivedEventRegisterProvider} = this.app.dal
        const condition = {
            triggerDate: {$gte: moment({hour: 0}).toDate(), $lt: moment({hour: 24}).toDate()}
        }

        await dateArrivedEventRegisterProvider.model.distinct('triggerUnixTimestamp', condition).then(triggerEvents => {
            triggerEvents.forEach(triggerUnixTimestamp => timerService.addTimerTask(triggerUnixTimestamp, () => {
                this.app.emit(OutsideEvent, outsideEvents.DateArrivedEvent, triggerUnixTimestamp)
            }))
        })
    }
}
