export enum ContractAllowRegisterEventEnum {

    /**
     * 周期结束事件
     */
    EndOfCycleEvent = 'A101',

    /**
     * 绝对时间事件
     * @type {string}
     */
    AbsolutelyTimeEvent = 'A102',

    /**
     * 相对时间事件
     * @type {string}
     */
    RelativeTimeEvent = 'A103'
}

/**
 * 定时任务状态枚举
 */
export enum HashedWheelTimeoutStateEnum {
    /**
     * 等待触发
     */
    Waiting = 1,

    /**
     * 已取消
     */
    Cancelled = 2,

    /**
     * 已过期
     */
    Expired = 3
}

/**
 * 事件注册者类型枚举
 */
export enum EventRegisterInitiatorTypeEnum {
    /**
     * 合同服务
     */
    ContractService = 1,
}
