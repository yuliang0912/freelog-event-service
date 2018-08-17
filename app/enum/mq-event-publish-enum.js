'use strict'

module.exports = {

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
    PresentableSignEvent: {
        routingKey: 'register.event.trigger',
        eventName: 'presentableSignEvent'
    },

    /**
     * presentable签约数量
     */
    PresentableSignCountTallyEvent: {
        routingKey: 'register.event.trigger',
        eventName: 'presentableSignCountTallyEvent'
    }
}