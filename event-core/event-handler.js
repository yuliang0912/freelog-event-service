/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')
const uuid = require('node-uuid')
const contractEventProvider = require('../app/data-provider/contract-event-provider')
const contractCountProvider = require('../app/data-provider/contract-count-provider')
const contractCountSubject = require('../observer/index').contractCountSubject()

module.exports = {

    /**
     * 创建合同事件(事件服务自动注册合同过期事件)
     * @param message
     * @param headers
     * @param deliveryInfo
     * @param messageObject
     */
    async registerContractExpireEventHandler(message, headers, deliveryInfo, messageObject){

        let contractExpireEvent = {
            eventId: messageObject.messageId || uuid.v4(),
            contractId: message.contractId,
            eventType: eggApp.eventRegisterType.contractExpire,
            eventParams: JSON.stringify({
                expireDate: message.expireDate
            }),
            triggerCount: 0,
            triggerLimit: 1,
            createDate: moment().toDate()
        }

        await contractEventProvider.registerContractEvent(contractExpireEvent).then(() => {
            messageObject.acknowledge(false)
        }).catch(console.error)
    },

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
            eventId: messageObject.messageId || uuid.v4(),
            contractId: message.contractId,
            eventType: message.eventType,
            eventParams: JSON.stringify(message.eventParams),
            triggerCount: 0,
            triggerLimit: message.triggerLimit,
            createDate: moment().toDate()
        }

        if (Object.values(eggApp.eventRegisterType).some(type => type !== model.eventType)) {
            console.log('事件注册失败', message)
            return
        }

        await contractEventProvider.registerContractEvent(model)
    }
}