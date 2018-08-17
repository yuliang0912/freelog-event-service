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
     * presentable签约事件
     */
    PresentableSignEvent: Symbol(`outsideEvent#presentableSignEvent`),

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
     * 内部公共类型枚举事件
     */
    PresentableSignEvent: Symbol(`internalSubjectEvent#presentableSignEvent`),

    /**
     * 统计类事件
     */
    TallyEvent: Symbol(`internalSubjectEvent#tallyEvent`)
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

    /**
     * 内部签约presentable事件
     */
    PresentableSignEvent: Symbol(`internalEvent#presentableSignEvent`),

}