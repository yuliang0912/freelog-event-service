'use strict'

module.exports = {

    /**
     * 发送周期结束事件广播
     */
    EndOfCycleBroadcastEvent: {
        routingKey: 'event.endOfCycle.event',
        eventName: 'endOfCycleEvent'
    },

    /**
     * 注册的周期结束事件触发
     */
    EndOfCycleTriggerEvent: {
        routingKey: 'register.event.trigger',
        eventName: 'endOfCycleEvent'
    },

    /**
     * 注册的日期到达事件触发
     */
    DateArrivedTriggerEvent: {
        routingKey: 'register.event.trigger',
        eventName: 'dateArrivedEvent'
    },

    /**
     * presentable签约数量
     */
    PresentableConsumptionCountTallyEvent: {
        routingKey: 'register.event.trigger',
        eventName: 'presentableConsumptionCountTallyEvent'
    },

    /**
     * 事件注册完成
     */
    EventRegisterCompletedEvent: {
        routingKey: 'register.event.completed',
    }
}