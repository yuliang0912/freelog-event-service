import {provide, scope} from 'midway';
import {HashedWheelTimer} from './hashed-wheel-timer';

@provide()
@scope('Singleton')
export class TimeoutTaskTimer {

    private hashedWheelTimer: HashedWheelTimer;

    constructor() {
        this.hashedWheelTimer = new HashedWheelTimer(20, 3);
    }

    startUp() {
        this.hashedWheelTimer.startup();
    }

    /**
     * 新增定时任务
     * @param taskId
     * @param triggerDate
     * @param callback
     */
    addTimerTask(taskId: string, triggerDate: Date, callback: (...args) => void) {
        return this.hashedWheelTimer.addTimedTask(taskId, triggerDate, callback);
    }

    _test() {
        const triggerDate = new Date();
        triggerDate.setSeconds(triggerDate.getSeconds() + 10);

        this.addTimerTask(triggerDate.toISOString(), triggerDate, function (taskId: string) {
            console.log(`定时任务已触发，预计触发时间：${triggerDate.toISOString()}，实际触发时间：${new Date().toISOString()}。`, taskId);
        });
    }
}
