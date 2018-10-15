'use strict'

module.exports = {

    /**
     * 外部事件
     */
    OutsideEvent: Symbol('app#event#outsideEvent'),

    /**
     * 内部主题事件
     */
    InternalSubjectEvent: Symbol('app#event#internalSubjectEvent'),

    /**
     * 内部连锁事件
     */
    InternalChainEvent: Symbol('app#event#internalChainEvent'),

    /**
     * 注册或者取消注册事件
     */
    RegisterOrUnregisterEvent: Symbol(`app#event#registerOrUnregisterEvent`),
}


module.exports.outsideEvents = {

    /**
     * 周期结束事件
     */
    EndOfCycleEvent: Symbol(`outsideEvent#endOfCycleEvent`),

    /**
     * 时间到达注册事件
     */
    DateArrivedEvent: Symbol(`outsideEvent#dateArrivedEvent`),

    /**
     * presentable消费事件
     */
    PresentableConsumptionCountChangedEvent: Symbol(`outsideEvent#presentableConsumptionEvent`),
}

module.exports.internalSubjectEvents = {

    /**
     * 周期结束事件
     */
    EndOfCycleEvent: Symbol(`internalSubjectEvent#endOfCycleEvent`),

    /**
     * 时间到达注册事件
     */
    DateArrivedEvent: Symbol(`internalSubjectEvent#dateArrivedEvent`),

    /**
     * 统计类事件
     */
    TallyEvent: Symbol(`internalSubjectEvent#tallyEvent`),

    /**
     * 事件注册完成事件
     */
    RegisterCompletedEvent: Symbol(`internalSubjectEvent#RegisterCompletedEvent`),
}

module.exports.internalChainEvents = {

    /**
     * 周期结束事件
     */
    EndOfCycleEvent: Symbol(`internalEvent#endOfCycleEvent`),

    /**
     * 时间到达注册事件
     */
    DateArrivedEvent: Symbol(`internalEvent#dateArrivedEvent`),
}