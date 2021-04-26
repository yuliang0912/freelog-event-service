"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashedWheelTimer = void 0;
const hashed_wheel_slot_1 = require("./hashed-wheel-slot");
const hashed_wheel_task_1 = require("./hashed-wheel-task");
const egg_freelog_base_1 = require("egg-freelog-base");
class HashedWheelTimer {
    /**
     * @param ticksPerWheel 每轮槽位数
     * @param tickDuration  每槽间隔时间(秒)
     */
    constructor(ticksPerWheel, tickDuration) {
        this.allWheels = new Map();
        this.currentTickIndex = -1;
        // 待分配的任务
        this.toBeAllocateTasks = [];
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
    addTimedTask(taskId, triggerDate, callback) {
        if (!this.startTimeline) {
            throw new egg_freelog_base_1.ApplicationError('定时轮未启动');
        }
        const currentTimeline = Date.now();
        let deadline = currentTimeline - this.startTimeline;
        if (triggerDate.getTime() > currentTimeline) {
            deadline = triggerDate.getTime() - this.startTimeline;
        }
        // 任务超时时间以秒为单位计算,任务会先存放到queue中,等待下一次tick前存放到正确的wheel和slot中
        const wheelTimeout = new hashed_wheel_task_1.HashedWheelTask(taskId, Math.floor(deadline / 1000), callback);
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
            const wheelIndex = Math.floor(item.deadline / this.totalTimePerWheel);
            const slotIndex = Math.floor((item.deadline % this.totalTimePerWheel) / this.tickDuration);
            if (!this.allWheels.has(wheelIndex)) {
                this.allWheels.set(wheelIndex, new Map());
            }
            const targetWheel = this.allWheels.get(wheelIndex);
            if (!targetWheel.has(slotIndex)) {
                targetWheel.set(slotIndex, new hashed_wheel_slot_1.HashedWheelSlot(wheelIndex, slotIndex));
            }
            targetWheel.get(slotIndex).add(item);
        }
    }
    /**
     * 获取当前循环轮次的下标
     */
    get currWheelIndex() {
        return Math.floor(this.currentTickIndex / this.ticksPerWheel);
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
        const currSlotIndex = this.currentTickIndex % this.ticksPerWheel;
        return this.currWheel?.get(currSlotIndex);
    }
}
exports.HashedWheelTimer = HashedWheelTimer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGVkLXdoZWVsLXRpbWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhc2hlZC13aGVlbC10aW1lci9oYXNoZWQtd2hlZWwtdGltZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQW1EO0FBQ25ELDJEQUFvRDtBQUNwRCx1REFBa0Q7QUFFbEQsTUFBYSxnQkFBZ0I7SUFhekI7OztPQUdHO0lBQ0gsWUFBWSxhQUFxQixFQUFFLFlBQW9CO1FBVHZELGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBd0MsQ0FBQztRQUM1RCxxQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixTQUFTO1FBQ1Qsc0JBQWlCLEdBQXNCLEVBQUUsQ0FBQztRQU90QyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxHQUFHLFlBQVksQ0FBQztJQUMxRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUI7UUFDYixJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQixLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsSUFBSSxFQUFFLEVBQUU7WUFDL0QsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFlBQVksQ0FBQyxNQUFjLEVBQUUsV0FBaUIsRUFBRSxRQUFvQjtRQUVoRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNyQixNQUFNLElBQUksbUNBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDeEM7UUFDRCxNQUFNLGVBQWUs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