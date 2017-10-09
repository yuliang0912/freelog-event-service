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

        let sql = `INSERT ignore INTO contractEventRegister(eventId,contractId,eventType,eventParams,triggerCount,triggerLimit,triggerDate,createDate) 
                 VALUES (:eventId,:contractId,:eventType,:eventParams,:triggerCount,:triggerLimit,:triggerDate,:createDate)`

        return eggApp.knex.contract.raw(sql, model)
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
     * 获取合同事件
     * @param condition
     * @returns {Promise.<*>}
     */
    getContractEventList(endTriggerDate, eventType, page, pageSize) {

        return eggApp.knex.contract('contractEventRegister')
            .where({eventType})
            .where('triggerDate', '<', endTriggerDate)
            .where('triggerCount', 0)
            .limit(pageSize)
            .offset((page - 1) * pageSize)
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