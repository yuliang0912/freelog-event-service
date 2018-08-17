'use strict'

const {PresentableSignEvent} = require('../../enum/event-type-enum')
const appEventEmitterEnum = require('../../enum/app-event-emitter-enum')
const {PresentableSignCount} = require('../../enum/tally-statistics-subject-type')

module.exports = class SignPresentableEventHandler {

    constructor(app) {
        this.app = app
        this.tallyStatisticsProvider = app.dal.tallyStatisticsProvider
        this.enumerateEventRegisterProvider = app.dal.enumerateEventRegisterProvider
    }

    /**
     * 签约presentable事件处理
     * @param eventInfo
     */
    async handler({presentableId}) {

        //先更新完统计总数,再发送其他事件,确保其他事件查询总数时没问题
        const presentableTallyStatistics = await this.updateTallyStatistics({presentableId}).catch(console.error)

        const triggerEvents = await this.enumerateEventRegisterProvider.find({
            subjectId: presentableId,
            eventType: PresentableSignEvent,
            status: 1
        })

        triggerEvents.forEach(item => this.emitSignPresentableEvent(item, presentableTallyStatistics))
    }

    /**
     * 发起签约presentable事件
     * @param eventInfo
     */
    emitSignPresentableEvent(eventInfo, presentableTallyStatistics) {

        const {InternalSubjectEvent, InternalChainEvent, internalSubjectEvents, internalChainEvents} = appEventEmitterEnum

        if (eventInfo.isChainEvent) {
            this.app.emit(InternalChainEvent, internalChainEvents.PresentableSignEvent, eventInfo, presentableTallyStatistics)
        }
        if (eventInfo.isSubjectEvent) {
            this.app.emit(InternalSubjectEvent, internalSubjectEvents.PresentableSignEvent, eventInfo, presentableTallyStatistics)
        }
    }

    /**
     * 更新计数器
     * @param presentable
     */
    updateTallyStatistics({presentableId}) {

        const condition = {
            subjectId: presentableId,
            subjectType: PresentableSignCount
        }

        return this.tallyStatisticsProvider.findOneAndUpdate(condition, {$inc: {count: 1}}).then(oldInfo => {
            return oldInfo ? this.tallyStatisticsProvider.findOne(condition) : this.tallyStatisticsProvider.create(condition)
        })
    }
}