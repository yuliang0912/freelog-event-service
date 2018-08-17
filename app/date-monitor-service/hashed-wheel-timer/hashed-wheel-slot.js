/**
 * Created by yuliang on 2017/9/28.
 */

'use strict'

/**
 * 轮中的槽位
 * @type {HashedWheelSlot}
 */
module.exports = class HashedWheelSlot {

    constructor(wheelIndex, slotIndex) {
        this.slotIndex = slotIndex
        this.wheelIndex = wheelIndex
        this.timeoutTaskArray = new Map()
    }

    /**
     * 新增定时任务到槽中
     * @param timeoutTask
     */
    add(timeoutTask) {
        if (!this.timeoutTaskArray.has(timeoutTask.taskId)) {
            this.timeoutTaskArray.set(timeoutTask.taskId, timeoutTask)
            console.log(new Date(), `addTask: ${timeoutTask.taskId},slotIndex:${this.slotIndex},wheelIndex:${this.wheelIndex}`)
        }
    }

    /**
     * 是否是指定index的槽
     * @param slotIndex
     * @returns {boolean}
     */
    equals(slotIndex) {
        return this.slotIndex === slotIndex
    }
}