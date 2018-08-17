/**
 * Created by yuliang on 2017/9/28.
 */

'use strict'

const HashedWheelSlot = require('./hashed-wheel-slot')
const HashedWheelTimeout = require('./hashed-wheel-timeout')

/**
 * hashedWheelTimer 轮询计时触发器
 * @type {hashedWheelTimer}
 */
module.exports = class hashedWheelTimer {

    /**
     * @param ticksPerWheel 每轮槽位数
     * @param tickDuration  每槽间隔时间(秒)
     */
    constructor(ticksPerWheel, tickDuration) {
        this.ticksPerWheel = ticksPerWheel
        this.tickDuration = tickDuration
        this.allWheels = new Map()
        this.startTime = null
        this.currentTickIndex = -1
        this.timeoutQueue = []
        this.totalTimePerWheel = ticksPerWheel * tickDuration
    }

    /**
     * 获取当前循环轮次的下标
     * @returns {number}
     */
    get currWheelIndex() {
        return Math.floor(this.currentTickIndex / this.ticksPerWheel)
    }

    /**
     * 获取当前轮
     * @returns {V}
     */
    get currWheel() {
        return this.allWheels.get(this.currWheelIndex)
    }

    /**
     * 获取当前轮的当前槽位
     * @returns {undefined}
     */
    get currSlot() {
        const currSlotIndex = this.currentTickIndex % this.ticksPerWheel
        return this.currWheel ? this.currWheel.get(currSlotIndex) : undefined
    }

    /**
     * 每次指针跳动时执行的任务
     */
    tick() {

        this.currentTickIndex += 1
        this.buildWheel()

        const currSlot = this.currSlot

        currSlot && currSlot.timeoutTaskArray.forEach(task => task.expireTimeout())

        this.clearPrevWheel()
    }

    /**
     * 重复造轮子
     */
    buildWheel() {
        const queueLength = this.timeoutQueue.length

        this.timeoutQueue.forEach(item => {
            const wheelIndex = Math.floor(item.deadline / this.totalTimePerWheel)
            const slotIndex = Math.floor((item.deadline % this.totalTimePerWheel) / this.tickDuration)

            if (!this.allWheels.has(wheelIndex)) {
                this.allWheels.set(wheelIndex, new Map())
            }

            const targetWheel = this.allWheels.get(wheelIndex)
            if (!targetWheel.has(slotIndex)) {
                targetWheel.set(slotIndex, new HashedWheelSlot(wheelIndex, slotIndex))
            }
            targetWheel.get(slotIndex).add(item)
        })

        //此处没有clear数组,是担心forEach时有新的task push到数组中,导致误清除
        this.timeoutQueue.splice(0, queueLength)
    }

    /**
     * 新增一个定时任务
     * @param hashedWheelTimeout
     */
    newTimeout(taskId, timerTask, taskExpireTime) {
        this.start()

        var deadline = Date.now() - this.startTime
        if (taskExpireTime > new Date()) {
            deadline = taskExpireTime.getTime() - this.startTime
        }

        //任务超时时间以秒为单位计算,任务会先存放到queue中,等待下一次tick前存放到正确的wheel和slot中
        const wheelTimeout = new HashedWheelTimeout(taskId, timerTask, Math.floor(deadline / 1000))

        this.timeoutQueue.push(wheelTimeout)

        return wheelTimeout
    }


    /**
     * 开始执行timer
     */
    start() {
        if (!this.startTime) {
            this.startTime = Date.now()
            setInterval(() => this.tick(), this.tickDuration * 1000)
        }
    }

    /**
     * 清空上一轮的任务
     */
    clearPrevWheel() {
        //第二轮开始执行时,清空上一轮的所有数据
        if (this.currentTickIndex % this.ticksPerWheel === 0) {
            this.allWheels.delete(this.currWheelIndex - 1)
        }
    }
}


