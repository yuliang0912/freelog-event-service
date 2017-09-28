/**
 * Created by yuliang on 2017/9/28.
 */

'use strict'

const HashedWheelTimeoutState = {
    Waiting: 'Waiting',
    Cancelled: 'Cancelled',
    Expired: 'Expired'
}

/**
 * 需要执行的超时任务体
 * @type {HashedWheelTimeout}
 */
module.exports = class HashedWheelTimeout {

    constructor(task, deadline) {
        this._state = HashedWheelTimeoutState.Waiting
        this._task = task
        this.deadline = deadline
    }

    /**
     * 获取任务状态
     * @returns {string|*|string}
     */
    get state() {
        return this._state
    }

    /**
     * 取消超时任务
     */
    cancel() {
        this._state = HashedWheelTimeoutState.Cancelled
    }

    /**
     * 执行超时任务
     */
    expireTimeout() {
        if (this._state === HashedWheelTimeoutState.Waiting) {
            this._task.call(null)
        }
    }
}