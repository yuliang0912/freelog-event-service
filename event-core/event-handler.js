/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')
const uuid = require('node-uuid')
const eventType = require('./event-type')
const contractEventProvider = require('../app/data-provider/contract-event-provider')

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
            eventType: eventType.contractExpire,
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
    async contractEffectiveAuthEvent(message, headers, deliveryInfo, messageObject){

    }
}