/**
 * Created by yuliang on 2017/9/18.
 */

'use strict'

const observerId = 'PresentableEffectiveAuthObserver'
const baseObserver = require('./base-observer')
const contractEventProvider = require('../app/data-provider/contract-event-provider')

/**
 * 用户与presentable签订的合同首次激活观察者
 * @type {PresentableEffectiveAuthObserver}
 */
module.exports = class PresentableEffectiveAuthObserver extends baseObserver {

    constructor(subject) {
        super()
        this.id = observerId
        this.subject = subject
        this.contractCount = {}
        this.subject.registerObserver(this)
    }

    /**
     * 合同统计数量主题变更函数.
     * @param model 参考mysql-table:contractCount
     */
    async update(model) {
        if (model.countType !== eggApp.eventCountType.PresentableContractEffectiveAuth) {
            return
        }
        this.contractCount = model

        await contractEventProvider.getContractEvents({contractId: model.contractId, status: 0}, [
            eggApp.eventRegisterType.contractEffectiveAuthCount,
            eggApp.eventRegisterType.contractEffectiveAuthIncreaseCount
        ]).then().each(eventRegister => {
            switch (eventRegister.eventType) {
                case eggApp.eventRegisterType.contractEffectiveAuthCount:
                    this.contractEffectiveAuthCountHandler(eventRegister)
                    break
                case eggApp.eventRegisterType.contractEffectiveAuthIncreaseCount:
                    this.contractEffectiveAuthIncreaseCountHandler(eventRegister)
                    break
            }
        })
    }

    /**
     * 合同有效授权次数事件
     */
    async contractEffectiveAuthCountHandler(eventRegister) {

        //超过触发限制或者没有达到触发条件,则返回
        if (eventRegister.triggerCount >= eventRegister.triggerLimit ||
            this.contractCount.count < eventRegister.eventParams.count) {
            return
        }

        /**
         * 发布回调事件
         */
        eggApp.rabbitClient.publish({
            routingKey: eventRegister.eventParams.routingKey,
            eventName: eventRegister.eventParams.eventName,
            body: this.contractCount
        }).then(() => {
            return contractEventProvider.addTriggerCount(eventRegister.eventId)
        }).catch(console.log)
    }

    /**
     * 合同有效授权次数循环递增事件
     */
    async contractEffectiveAuthIncreaseCountHandler(eventRegister) {
        if (eventRegister.triggerCount >= eventRegister.triggerLimit ||
            this.contractCount.count % eventRegister.eventParams.count !== 0) {
            return
        }

        /**
         * 发布回调事件
         */
        eggApp.rabbitClient.publish({
            routingKey: eventRegister.eventParams.routingKey,
            eventName: eventRegister.eventParams.eventName,
            body: this.contractCount
        }).then(() => {
            return contractEventProvider.addTriggerCount(eventRegister.eventId)
        }).catch(console.log)
    }
}