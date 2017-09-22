/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

module.exports = {

    /**
     * 注册合同事件
     * @param model
     */
    registerContractEvent(model) {
        if (!eggApp.type.object(model)) {
            return Promise.reject(new Error("model is not object"))
        }

        return eggApp.knex.contract.raw(
            `INSERT ignore INTO contractEventRegister(eventId,contractId,eventType,eventParams,triggerCount,triggerLimit,createDate) 
          VALUES (:eventId,:contractId,:eventType,:eventParams,:triggerCount,:triggerLimit,:createDate)`, model)
    },

    /**
     * 获取合同事件
     * @param condition
     * @returns {Promise.<*>}
     */
    getContractEvents(condition, eventTypes = []) {
        if (!eggApp.type.object(condition)) {
            return Promise.reject(new Error("condition is not object"))
        }

        let query = eggApp.knex.contract('contractEventRegister').where(condition)

        if (Array.isArray(eventTypes) && eventTypes.length > 0) {
            query.whereIn('eventType', eventTypes)
        }
        return query.select()
    },

    /**
     * 新增触发次数
     * @param eventId
     * @returns {Promise.<TResult>}
     */
    addTriggerCount(eventId){
        return eggApp.knex.contract('contractEventRegister').where({eventId}).increment('triggerCount', 1).then()
    },

    /**
     * 删除已注册的事件
     * @param eventId
     */
    deleteContractEvent(condition){
        if (!eggApp.type.object(condition)) {
            return Promise.reject(new Error("condition is not object"))
        }
        return eggApp.knex.contract('contractEventRegister').where(condition).delete().then()
    }
}