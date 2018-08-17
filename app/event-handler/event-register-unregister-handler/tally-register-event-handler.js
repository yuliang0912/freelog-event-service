'use strict'

const uuid = require('uuid')
const Patrun = require('Patrun')
const eventTypeEnum = require('../../enum/event-type-enum')
const {InternalTallyEvent} = require('../../enum/event-initiator-type')
const {RegisterOrUnregisterEvent} = require('../../enum/app-event-emitter-enum')
const {PresentableSignCount} = require('../../enum/tally-statistics-subject-type')
const {InternalSubjectEvent, internalSubjectEvents} = require('../../enum/app-event-emitter-enum')

module.exports = class EnumerateRegisterEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerSubEventHandler()
        this.tallyEventRegisterProvider = app.dal.tallyEventRegisterProvider
        this.tallyStatisticsProvider = app.dal.tallyStatisticsProvider
    }

    /**
     * 事件取消注册处理
     */
    async registerHandler(message, eventType) {

        const {subjectId, eventRegisterNo, initiatorType, comparisonValue, comparisonOperator, callbackParams, triggerLimit = 1} = message
        const model = {
            subjectId, triggerLimit, eventType, eventRegisterNo, initiatorType, callbackParams,
            subscribeEnumEvent: {
                eventNo: uuid.v4().replace(/-/g, ''), eventType, comparisonValue, comparisonOperator
            }
        }

        const tallyEvent = await this.tallyEventRegisterProvider.create(model)
            .catch(error => this.errorHandler(error, message, eventType))

        const subEventHandler = this.patrun.find({eventType, registerType: 'register'})
        if (!subEventHandler) {
            tallyEvent.eventTriggerFailed()
            return
        }
        subEventHandler(tallyEvent).catch(error => this.errorHandler(error))
    }

    /**
     * 事件取消注册处理
     */
    async unregisterHandler(message) {

        const {eventRegisterNo, initiatorType} = message
        const tallyEventInfo = await this.tallyEventRegisterProvider.findOne({eventRegisterNo, initiatorType})
        if (!tallyEventInfo) {
            return
        }
        await this.tallyEventRegisterProvider.deleteOne({eventRegisterNo, initiatorType})
        const subEventHandler = this.patrun.find({eventType: tallyEventInfo.eventType, registerType: 'unregister'})
        subEventHandler({eventRegisterNo: tallyEventInfo.id.toString(), initiatorType: InternalTallyEvent})
    }

    /**
     * 统计事件注册侦听presentable签约事件
     * @param tallyEvent
     */
    async registerPresentableSignEvent(tallyEvent) {

        const {subjectId, id, subscribeEnumEvent} = tallyEvent
        const presentableTallyStatistics = await this.tallyStatisticsProvider.findOne({
            subjectId,
            subjectType: PresentableSignCount
        })

        if (presentableTallyStatistics && tallyEvent.subscribeEnumEvent.contrast(presentableTallyStatistics.count)) {
            if (tallyEvent.isSubjectEvent) {
                this.app.emit(InternalSubjectEvent, internalSubjectEvents.TallyEvent, tallyEvent)
            } else {
                console.log('没有场景')
            }
            return
        }

        const message = {
            subjectId, eventRegisterNo: id.toString(),
            initiatorType: InternalTallyEvent,
            callbackParams: subscribeEnumEvent,
            triggerLimit: 0
        }

        this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.PresentableSignEvent, 'register', message)
    }

    /**
     * 取消注册
     * @param tallyEvent
     * @returns {Promise<void>}
     */
    async unregisterPresentableSignEvent(message) {
        this.app.emit(RegisterOrUnregisterEvent, eventTypeEnum.PresentableSignEvent, 'unregister', message)
    }


    /**
     * 注册子事件处理者
     */
    registerSubEventHandler() {

        const {patrun} = this

        patrun.add({
            eventType: eventTypeEnum.PresentableSignCountTallyEvent,
            registerType: 'register'
        }, this.registerPresentableSignEvent.bind(this))

        patrun.add({
            eventType: eventTypeEnum.PresentableSignCountTallyEvent,
            registerType: 'unregister'
        }, this.unregisterPresentableSignEvent.bind(this))
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandler(error, message, eventType) {
        this.app.logger.error('tally-register-event-handler事件执行异常', {error, message, eventType})
    }
}