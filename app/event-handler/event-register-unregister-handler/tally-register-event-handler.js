'use strict'

const Patrun = require('patrun')
const {PresentableConsumptionCountTallyEvent} = require('../../enum/event-type-enum')
const {InternalSubjectEvent, internalSubjectEvents} = require('../../enum/app-event-emitter-enum')

module.exports = class EnumerateRegisterEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.tallyEventRegisterProvider = app.dal.tallyEventRegisterProvider
    }

    /**
     * 事件取消注册处理
     */
    async registerHandle(message, eventType) {

        const {subjectId, eventRegisterNo, initiatorType, comparisonValue, comparisonOperator, callbackParams, triggerLimit = 1} = message
        const model = {
            subjectId, triggerLimit, eventType, eventRegisterNo, initiatorType,
            comparisonValue, comparisonOperator, callbackParams,
        }

        await this.tallyEventRegisterProvider.create(model).then(this.tryTriggerEvent)
            .catch(error => this.errorHandle(error, message, eventType))
    }

    /**
     * 事件取消注册处理
     */
    async unregisterHandle(message) {

        const {eventRegisterNo, initiatorType} = message
        const tallyEventInfo = await this.tallyEventRegisterProvider.findOne({eventRegisterNo, initiatorType})
        if (!tallyEventInfo) {
            return
        }
        return this.tallyEventRegisterProvider.deleteOne({eventRegisterNo, initiatorType})
    }

    /**
     * 统计事件注册侦听presentable签约事件
     * @param tallyEvent
     */
    async tryTriggerEvent(tallyEvent) {

        const {subjectId} = tallyEvent

        if (tallyEvent.eventType === PresentableConsumptionCountTallyEvent) {
            const presentableTallyStatistics = await this.getPresentableConsumptionStatisticsInfo(subjectId)
            if (!presentableTallyStatistics || !tallyEvent.isMatch(presentableTallyStatistics.totalCount)) {
                return
            }
            this.app.emit(InternalSubjectEvent, internalSubjectEvents.TallyEvent, tallyEvent)
        }
    }

    /**
     * 获取presentable消费统计信息
     * @returns {Promise<void>}
     */
    async getPresentableConsumptionStatisticsInfo(presentableId) {
        return this.app.curl(`${this.app.webApi.statisticsInfo}/presentableConsumptionStatistics`, {data: {presentableId}})
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandle(error, message, eventType) {
        this.app.logger.error('tally-register-event-handler事件执行异常', {error, message, eventType})
    }
}