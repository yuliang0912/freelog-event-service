import { HashedWheelSlot } from './hashed-wheel-slot';
import { HashedWheelTask } from './hashed-wheel-task';
export declare class HashedWheelTimer {
    ticksPerWheel: number;
    tickDuration: number;
    totalTimePerWheel: number;
    startTimeline: number;
    allWheels: Map<number, Map<number, HashedWheelSlot>>;
    currentTickIndex: number;
    toBeAllocateTasks: HashedWheelTask[];
    /**
     * @param ticksPerWheel 每轮槽位数
     * @param tickDuration  每槽间隔时间(秒)
     */
    constructor(ticksPerWheel: number, tickDuration: number);
    /**
     * 每次指针跳动时执行的任务
     */
    pointerTickHandle(): void;
    /**
     * 新增一个定时任务
     * @param taskId
     * @param triggerDate
     * @param callback
     */
    addTimedTask(taskId: string, triggerDate: Date, callback: () => void): HashedWheelTask;
    /**
     * 开始执行timer
     */
    startup(): void;
    /**
     * 清空上一轮的任务
     */
    clearPrevWheel(): void;
    /**
     * 重复造轮子
     */
    buildWheel(): void;
    /**
     * 获取当前循环轮次的下标
     */
    get currWheelIndex(): number;
    /**
     * 获取当前转轮
     */
    get currWheel(): Map<number, HashedWheelSlot>;
    /**
     * 获取当前轮的当前槽位
     */
    get currSlot(): HashedWheelSlot;
}
