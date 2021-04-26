"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegisterInitiatorTypeEnum = exports.HashedWheelTimeoutStateEnum = exports.ContractAllowRegisterEventEnum = void 0;
var ContractAllowRegisterEventEnum;
(function (ContractAllowRegisterEventEnum) {
    /**
     * 周期结束事件
     */
    ContractAllowRegisterEventEnum["EndOfCycleEvent"] = "A101";
    /**
     * 绝对时间事件
     * @type {string}
     */
    ContractAllowRegisterEventEnum["AbsolutelyTimeEvent"] = "A102";
    /**
     * 相对时间事件
     * @type {string}
     */
    ContractAllowRegisterEventEnum["RelativeTimeEvent"] = "A103";
})(ContractAllowRegisterEventEnum = exports.ContractAllowRegisterEventEnum || (exports.ContractAllowRegisterEventEnum = {}));
/**
 * 定时任务状态枚举
 */
var HashedWheelTimeoutStateEnum;
(function (HashedWheelTimeoutStateEnum) {
    /**
     * 等待触发
     */
    HashedWheelTimeoutStateEnum[HashedWheelTimeoutStateEnum["Waiting"] = 1] = "Waiting";
    /**
     * 已取消
     */
    HashedWheelTimeoutStateEnum[HashedWheelTimeoutStateEnum["Cancelled"] = 2] = "Cancelled";
    /**
     * 已过期
     */
    HashedWheelTimeoutStateEnum[HashedWheelTimeoutStateEnum["Expired"] = 3] = "Expired";
})(HashedWheelTimeoutStateEnum = exports.HashedWheelTimeoutStateEnum || (exports.HashedWheelTimeoutStateEnum = {}));
/**
 * 事件注册者类型枚举
 */
var EventRegisterInitiatorTypeEnum;
(function (EventRegisterInitiatorTypeEnum) {
    /**
     * 合同服务
     */
    EventRegisterInitiatorTypeEnum[EventRegisterInitiatorTypeEnum["ContractService"] = 1] = "ContractService";
})(EventRegisterInitiatorTypeEnum = exports.EventRegisterInitiatorTypeEnum || (exports.EventRegisterInitiatorTypeEnum = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9lbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQVksOEJBa0JYO0FBbEJELFdBQVksOEJBQThCO0lBRXRDOztPQUVHO0lBQ0gsMERBQXdCLENBQUE7SUFFeEI7OztPQUdHO0lBQ0gsOERBQTRCLENBQUE7SUFFNUI7OztPQUdHO0lBQ0gsNERBQTBCLENBQUE7QUFDOUIsQ0FBQyxFQWxCVyw4QkFBOEIsR0FBOUIsc0NBQThCLEtBQTlCLHNDQUE4QixRQWtCekM7QUFFRDs7R0FFRztBQUNILElBQVksMkJBZVg7QUFmRCxXQUFZLDJCQUEyQjtJQUNuQzs7T0FFRztJQUNILG1GQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILHVGQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILG1GQUFXLENBQUE7QUFDZixDQUFDLEVBZlcsMkJBQTJCLEdBQTNCLG1DQUEyQixLQUEzQixtQ0FBMkIsUUFldEM7QUFFRDs7R0FFRztBQUNILElBQVksOEJBS1g7QUFMRCxXQUFZLDhCQUE4QjtJQUN0Qzs7T0FFRztJQUNILHlHQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFMVyw4QkFBOEIsR0FBOUIsc0NBQThCLEtBQTlCLHNDQUE4QixRQUt6QyJ9