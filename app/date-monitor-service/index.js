'use strict'

const HashedWheelTimer = require('./hashed-wheel-timer/hashed-wheel-timer')

const TimerService = class TimerService {

    constructor() {
        this.timer = new HashedWheelTimer(20, 3)
    }

    /**
     * 新增计时任务
     * @param unixTimestamp
     * @param callback
     */
    addTimerTask(unixTimestamp, callback) {
        this.timer.newTimeout(unixTimestamp, callback, new Date(unixTimestamp * 1000))
    }
}

module.exports = new TimerService()