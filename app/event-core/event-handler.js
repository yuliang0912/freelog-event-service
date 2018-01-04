/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')
const uuid = require('node-uuid')
const contractCountSubject = require('../observer/index').contractCountSubject()

module.exports = app => {

    const provider = app.dataProvider

    return {
        /**
         * 合同首次激活事件
         * @returns {Promise.<void>}
         */
        async contractEffectiveAuthEventHandler(message, headers, deliveryInfo, messageObject){
            let model = {
                contractId: message.contractId,
                countType: app.eventCountType.PresentableContractEffectiveAuth
            }

            await app.contractCountProvider.addContractCount(model).then(() => {
                return app.contractCountProvider.getContractCount(model).first()
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

            if (!Object.values(app.eventRegisterType).some(type => type == model.eventType)) {
                console.log('事件注册失败,不支持的事件类型', message)
                return
            }

            await provider.contractEventProvider.registerContractEvent(model).catch(() => {
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
            await provider.contractEventProvider.deleteContractEvent({
                eventId: message.eventId,
                contractId: message.contractId
            }).catch(console.error)
            messageObject.acknowledge(false)
        }
    }
}