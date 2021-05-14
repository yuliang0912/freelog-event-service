import { HashedWheelTimeoutStateEnum } from '../enum';
export declare class HashedWheelTask {
    taskId: string;
    deadline: number;
    state: HashedWheelTimeoutStateEnum;
    callback: () => void;
    constructor(taskId: string, deadline: number, callback: () => void);
    /**
     * 取消超时任务
     */
    cancelTask(): void;
    /**
     * 执行超时任务
     */
    executeTask(): any;
}
