import {HashedWheelTimeoutStateEnum} from '../enum';

export class HashedWheelTask {

    taskId: string;
    deadline: number;
    state = HashedWheelTimeoutStateEnum.Waiting;
    callback: () => void;

    constructor(taskId: string, deadline: number, callback: () => void) {
        this.callback = callback;
        this.taskId = taskId;
        this.deadline = deadline;
    }

    /**
     * 取消超时任务
     */
    cancelTask() {
        this.state = HashedWheelTimeoutStateEnum.Cancelled;
    }

    /**
     * 执行超时任务
     */
    executeTask() {
        if (this.state !== HashedWheelTimeoutStateEnum.Waiting) {
            return;
        }
        return Reflect.apply(this.callback, null, [this.taskId]);
    }
}
