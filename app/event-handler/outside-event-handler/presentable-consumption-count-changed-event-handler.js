'use strict'

const {PresentableConsumptionCountTallyEvent} = require('../../enum/event-type-enum')
const {InternalSubjectEvent, internalSubjectEvents} = require('../../enum/app-event-emitter-enum')

module.exports = class PresentableConsumptionCountChangedEventHandler {

    constructor(app) {
        this.app = app
        this.tallyEventRegisterProvider = app.dal.tallyEventRegisterProvider
    }

    /**
     * presentable消费次数变更事件处理
     */
    async handle(presentableTallyStatistics) {

        const {totalCount} = presentableTallyStatistics
        return this.tallyEventRegisterProvider.find({
            subjectId: presentableTallyStatistics.presentableId,
            eventType: PresentableConsumptionCountTallyEvent,
            status: 1
        }).each(eventInfo => {
            if (!eventInfo.isMatch(totalCount)) {
                return
            }
            this.app.emit(InternalSubjectEvent, internalSubjectEvents.TallyEvent, eventInfo)
        })
    }
}