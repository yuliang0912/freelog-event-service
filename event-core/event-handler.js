/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')
const uuid = require('node-uuid')
const contractEventProvider = require('../app/data-provider/contract-event-provider')
const contractCountProvider = require('../app/data-provider/contract-count-provider')
const contractCountSubject = require('../app/observer/index').contractCountSubject()

module.exports = {
    /**
     * 合同首次激活事件
     * @returns {Promise.<void>}
     */
    async contractEffectiveAuthEventHandler(message, headers, deliveryInfo, messageObject){
        let model = {
            contractId: message.contractId,
            countType: eggApp.eventCountType.PresentableContractEffectiveAuth
        }

        await contractCountProvider.addContractCount(model).then(() => {
            return contractCountProvider.getContractCount(model).first()
        }).then(contractCountModel => {
            contractCountSubject.setContractCount(contractCountModel)
        }).catch(console.error)

        messageObject.acknowledge(false)
    },

    /**
     * 事件中心接受其他服务的注册申请
     * @param message
     * @param headers
     * @param deliveryInfo
     * @param messageObject
     * @returns {Promise.<void>}
     */
    async registerEventHandler(message, headers, deliveryInfo, messageObject){
        let model = {
            eventId: message.eventId || messageObject.messageId || uuid.v4(),
            contractId: message.contractId,
            eventType: message.eventType,
            eventParams: JSON.stringify(message.eventParams),
            triggerCount: 0,
            triggerLimit: message.triggerLimit,
            triggerDate: message.triggerDate ? new Date(message.triggerDate) : '1970-1-1',
            createDate: moment().toDate()
        }

        if (!Object.values(eggApp.eventRegisterType).some(type => type == model.eventType)) {
            console.log('事件注册失败,不支持的事件类型', message)
            return
        }

        await contractEventProvider.registerContractEvent(model).catch(() => {
            console.log('register contract event error:', model)
        })
        messageObject.acknowledge(false)
    },

    /**
     * 事件中心取消已注册的事件
     * @param message
     * @param headers
     * @param deliveryInfo
     * @param messageObject
     * @returns {Promise.<void>}
     */
    async unRegisterEventHandler(message, headers, deliveryInfo, messageObject){
        await contractEventProvider.deleteContractEvent({
            eventId: message.eventId,
            contractId: message.contractId
        })
        messageObject.acknowledge(false)
    }
}