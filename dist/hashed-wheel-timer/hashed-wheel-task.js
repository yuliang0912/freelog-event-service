"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashedWheelTask = void 0;
const enum_1 = require("../enum");
class HashedWheelTask {
    constructor(taskId, deadline, callback) {
        this.state = enum_1.HashedWheelTimeoutStateEnum.Waiting;
        this.callback = callback;
        this.taskId = taskId;
        this.deadline = deadline;
    }
    /**
     * 取消超时任务
     */
    cancelTask() {
        this.state = enum_1.HashedWheelTimeoutStateEnum.Cancelled;
    }
    /**
     * 执行超时任务
     */
    executeTask() {
        if (this.state !== enum_1.HashedWheelTimeoutStateEnum.Waiting) {
            return;
        }
        Reflect.apply(this.callback, null, [this.taskId]);
    }
}
exports.HashedWheelTask = HashedWheelTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGVkLXdoZWVsLXRhc2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFzaGVkLXdoZWVsLXRpbWVyL2hhc2hlZC13aGVlbC10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtDQUFvRDtBQUVwRCxNQUFhLGVBQWU7SUFPeEIsWUFBWSxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxRQUFvQjtRQUhsRSxVQUFLLEdBQUcsa0NBQTJCLENBQUMsT0FBTyxDQUFDO1FBSXhDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7T0FFRztJQUNILFVBQVU7UUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLGtDQUEyQixDQUFDLFNBQVMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLGtDQUEyQixDQUFDLE9BQU8sRUFBRTtZQUNwRCxPQUFPO1NBQ1Y7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztDQUNKO0FBN0JELDBDQTZCQyJ9