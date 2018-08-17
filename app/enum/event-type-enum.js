'use strict'

/**
 * 事件服务接受外部服务注册的事件类型枚举
 */

module.exports = {

    /**
     * 周期结束事件
     */
    EndOfCycleEvent: 1,

    /**
     * 时间到达注册事件
     */
    DateArrivedEvent: 2,

    /**
     * presentable签约事件
     */
    PresentableSignEvent: 3,

    /**
     * presentable签约计次统计事件
     */
    PresentableSignCountTallyEvent: 4,

}

