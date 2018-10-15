'use strict'

const schedule = require('node-schedule')
const cycleHelper = require('egg-freelog-base/app/extend/helper/cycle-helper')
const {OutsideEvent, outsideEvents} = require('../enum/app-event-emitter-enum')

module.exports = class TimerCycleService {

    constructor(app) {
        this.app = app
        this.currentSchedule = null
        this.cycleIntervalMillisecond = 0
        setImmediate(() => this.initSchedule())
    }

    initSchedule() {
        //周期是以整数分钟,小时,天为基准单位划算成毫秒,周期不能超过下一个单位.
        const {cycleIntervalMillisecond} = cycleHelper.getCycleConfigSegment(new Date())

        this.cycleIntervalMillisecond = cycleIntervalMillisecond

        var cronScheduling = null
        //一小时为单位
        if (cycleIntervalMillisecond >= 3600000) {
            const hours = Math.ceil(cycleIntervalMillisecond / 3600000)
            cronScheduling = `0 0 */${hours} * * * *`
        }
        //以天为单位
        else if (cycleIntervalMillisecond >= 86400000) {
            const days = Math.ceil(cycleIntervalMillisecond / 86400000)
            cronScheduling = `0 0 * */${days} * * *`
        }
        //以分钟为单位
        else {
            const minutes = Math.ceil(cycleIntervalMillisecond / 60000)
            cronScheduling = `0 */${minutes} * * * * *`
        }

        this.currentSchedule = schedule.scheduleJob(cronScheduling, this.callback.bind(this))
    }

    /**
     * 周期结束回调
     */
    callback() {
        const {cycleIntervalMillisecond} = cycleHelper.getCycleConfigSegment(new Date())
        if (cycleIntervalMillisecond !== this.cycleIntervalMillisecond) {
            this.currentSchedule.cancel()
            this.initSchedule()
        }
        const cycleNumber = cycleHelper.getCycleNumber(new Date()) - 1
        this.app.emit(OutsideEvent, outsideEvents.EndOfCycleEvent, cycleNumber)
    }
}