import {HashedWheelSlot} from './hashed-wheel-slot'
import {HashedWheelTask} from './hashed-wheel-task';
import {ApplicationError} from 'egg-freelog-base';

export class HashedWheelTimer {

    // 每轮槽位数
    ticksPerWheel: number;
    // 每槽间隔时间(秒)
    tickDuration: number;
    totalTimePerWheel: number;
    startTimeline: number;
    allWheels = new Map<number, Map<number, HashedWheelSlot>>();
    currentTickIndex = -1;
    // 待分配的任务
    toBeAllocateTasks: HashedWheelTask[] = [];

    /**
     * @param ticksPerWheel 每轮槽位数
     * @param tickDuration  每槽间隔时间(秒)
     */
    constructor(ticksPerWheel: number, tickDuration: number) {
        this.ticksPerWheel = ticksPerWheel;
        this.tickDuration = tickDuration;
        this.totalTimePerWheel = ticksPerWheel * tickDuration;
    }

    /**
     * 每次指针跳动时执行的任务
     */
    pointerTickHandle() {
        this.currentTickIndex += 1;
        this.buildWheel();

        for (const [_, taskInfo] of this.currSlot?.timeoutTaskArray ?? []) {
            taskInfo.executeTask();
        }

        this.clearPrevWheel();
    }

    /**
     * 新增一个定时任务
     * @param taskId
     * @param triggerDate
     * @param callback
     */
    addTimedTask(taskId: string, triggerDate: Date, callback: () => void) {

        if (!this.startTimeline) {
            throw new ApplicationError('定时轮未启动');
        }
        const currentTimeline = Date.now();
        let deadline = currentTimeline - this.startTimeline;
        if (triggerDate.getTime() > currentTimeline) {
            deadline = triggerDate.getTime() - this.startTimeline;
        }

        // 任务超时时间以秒为单位计算,任务会先存放到queue中,等待下一次tick前存放到正确的wheel和slot中
        const wheelTimeout = new HashedWheelTask(taskId, Math.floor(deadline / 1000), callback);

        this.toBeAllocateTasks.push(wheelTimeout);

        return wheelTimeout;
    }

    /**
     * 开始执行timer
     */
    startup() {
        if (this.startTimeline) {
            return;
        }
        this.startTimeline = Date.now();
        setInterval(() => this.pointerTickHandle(), this.tickDuration * 1000);
    }

    /**
     * 清空上一轮的任务
     */
    clearPrevWheel() {
        // 第二轮开始执行时,清空上一轮的所有数据
        if (this.currentTickIndex % this.ticksPerWheel === 0) {
            this.allWheels.delete(this.currWheelIndex - 1);
        }
    }

    /**
     * 重复造轮子
     */
    buildWheel() {

        const queueLength = this.toBeAllocateTasks.length;
        for (const item of this.toBeAllocateTasks.splice(0, queueLength)) {
            const wheelIndex = Math.floor(item.deadline / this.totalTimePerWheel)
            const slotIndex = Math.floor((item.deadline % this.totalTimePerWheel) / this.tickDuration)
            if (!this.allWheels.has(wheelIndex)) {
                this.allWheels.set(wheelIndex, new Map());
            }
            const targetWheel = this.allWheels.get(wheelIndex);
            if (!targetWheel.has(slotIndex)) {
                targetWheel.set(slotIndex, new HashedWheelSlot(wheelIndex, slotIndex));
            }
            targetWheel.get(slotIndex).add(item);
        }
    }

    /**
     * 获取当前循环轮次的下标
     */
    get currWheelIndex() {
        return Math.floor(this.currentTickIndex / this.ticksPerWheel)
    }

    /**
     * 获取当前转轮
     */
    get currWheel() {
        return this.allWheels.get(this.currWheelIndex);
    }

    /**
     * 获取当前轮的当前槽位
     */
    get currSlot() {
        const currSlotIndex = this.currentTickIndex % this.ticksPerWheel
        return this.currWheel?.get(currSlotIndex);
    }
}
