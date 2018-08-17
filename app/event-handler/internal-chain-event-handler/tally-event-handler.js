// 计次服务需要考虑主动调用API获取次数,被动侦听事件获取次数.定时拉去API数据等方式共同组合实现,
// 确保事件满足条件时,可以被正确的触发

'use strict'

const Patrun = require('patrun')

const eventTypeEnum = require('../../enum/event-type-enum')
const {InternalSubjectEvent, internalSubjectEvents, internalChainEvents} = require('../../enum/app-event-emitter-enum')

module.exports = class TallyEventHandler {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerEventHandler()
        this.tallyEventRegisterProvider = app.dal.tallyEventRegisterProvider
    }

    /**
     * 计次服务注册的其他事件触发处理
     * @param eventName
     * @param eventInfo
     */
    async handler(eventName, eventInfo, ...args) {

        const {app, patrun} = this
        const eventHandler = patrun.find(this._buildPatrunKey(eventName, eventInfo.eventType))
        if (!eventHandler) {
            app.logger.info(`tally-event-handler:尚未注册事件${eventName.toString()}的处理函数`)
            return
        }

        const tallyEventInfo = await this.tallyEventRegisterProvider.findOne({
            _id: eventInfo.eventRegisterNo, status: 1
        })
        if (!tallyEventInfo) {
            eventInfo.eventTriggerFailed()
            app.logger.info(`tally-event-handler:原始注册者数据丢失或已完成,eventRegisterNo:${eventInfo.eventRegisterNo}`)
            return
        }
        eventHandler(eventInfo, tallyEventInfo, ...args)
    }

    /**
     * presentable签约事件
     */
    async presentableSignEventHandler(eventInfo, tallyEventInfo, presentableTallyStatistics) {

        if (!tallyEventInfo.subscribeEnumEvent.contrast(presentableTallyStatistics.count)) {
            return
        }

        if (tallyEventInfo.isSubjectEvent) {
            this.app.emit(InternalSubjectEvent, internalSubjectEvents.TallyEvent, tallyEventInfo)
        } else {
            console.log('目前没有场景')
        }

        this.app.logger.info(`trigger sign presentable count tally event, subjectId: ${tallyEventInfo.subjectId}`)
    }

    /**
     * 注册事件处理函数
     */
    registerEventHandler() {

        const {patrun} = this

        patrun.add(this._buildPatrunKey(internalChainEvents.PresentableSignEvent, eventTypeEnum.PresentableSignEvent), this.presentableSignEventHandler.bind(this))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventName, eventType) {
        return {eventName: eventName.toString(), eventType}
    }
}

