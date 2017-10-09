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

    constructor(taskId, task, deadline) {
        this.state = HashedWheelTimeoutState.Waiting
        this.task = task
        this.taskId = taskId
        this.deadline = deadline
    }

    /**
     * 取消超时任务
     */
    cancel() {
        this.state = HashedWheelTimeoutState.Cancelled
    }

    /**
     * 执行超时任务
     */
    expireTimeout() {
        if (this.state === HashedWheelTimeoutState.Waiting) {
            this.task.call(null)
        }
    }
}