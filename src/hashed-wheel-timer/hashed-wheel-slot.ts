import {HashedWheelTask} from './hashed-wheel-task';

export class HashedWheelSlot {

    slotIndex: number;
    wheelIndex: number;
    timeoutTaskArray = new Map<string, HashedWheelTask>();

    constructor(wheelIndex: number, slotIndex: number) {
        this.slotIndex = slotIndex;
        this.wheelIndex = wheelIndex;
    }

    /**
     * 新增定时任务到槽中
     * @param taskInfo
     */
    add(taskInfo: HashedWheelTask) {
        if (!this.timeoutTaskArray.has(taskInfo.taskId)) {
            this.timeoutTaskArray.set(taskInfo.taskId, taskInfo)
        }
    }

    /**
     * 是否是指定index的槽
     * @param slotIndex
     * @returns {boolean}
     */
    equals(slotIndex: number) {
        return this.slotIndex === slotIndex
    }
}
