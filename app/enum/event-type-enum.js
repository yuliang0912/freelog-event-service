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
     * presentable消费数量计次事件
     */
    PresentableConsumptionCountTallyEvent: 3
}

