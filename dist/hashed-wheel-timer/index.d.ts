export declare class TimeoutTaskTimer {
    private hashedWheelTimer;
    constructor();
    startUp(): void;
    /**
     * 新增定时任务
     * @param taskId
     * @param triggerDate
     * @param callback
     */
    addTimerTask(taskId: string, triggerDate: Date, callback: (...args: any[]) => void): import("./hashed-wheel-task").HashedWheelTask;
    _test(): void;
}
