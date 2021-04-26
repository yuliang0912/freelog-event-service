import { HashedWheelTask } from './hashed-wheel-task';
export declare class HashedWheelSlot {
    slotIndex: number;
    wheelIndex: number;
    timeoutTaskArray: Map<string, HashedWheelTask>;
    constructor(wheelIndex: number, slotIndex: number);
    /**
     * 新增定时任务到槽中
     * @param taskInfo
     */
    add(taskInfo: HashedWheelTask): void;
    /**
     * 是否是指定index的槽
     * @param slotIndex
     * @returns {boolean}
     */
    equals(slotIndex: number): boolean;
}
