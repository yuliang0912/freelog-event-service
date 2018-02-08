/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const KnexBaseOperation = require('egg-freelog-database/lib/database/knex-base-operation')

module.exports = class ContractEventProvider extends KnexBaseOperation {

    constructor(app) {
        super(app.knex.contract('contractEventRegister'))
        this.app = app
        this.contractKnex = app.knex.contract
    }


    /**
     * 注册合同事件
     * @param model
     */
    registerContractEvent(model) {

        let sql = `INSERT ignore INTO contractEventRegister(eventId,contractId,eventType,eventParams,triggerCount,triggerLimit,triggerDate,createDate) 
                 VALUES (:eventId,:contractId,:eventType,:eventParams,:triggerCount,:triggerLimit,:triggerDate,:createDate)`

        return this.contractKnex.raw(sql, model)
    }

    /**
     * 获取合同事件
     * @param condition
     * @returns {Promise.<*>}
     */
    getContractEvents(condition, eventTypes = []) {

        let baseQuery = super.find(condition)

        if (Array.isArray(eventTypes) && eventTypes.length > 0) {
            baseQuery.whereIn('eventType', eventTypes)
        }

        return baseQuery
    }

    /**
     * 获取合同事件
     * @param condition
     * @returns {Promise.<*>}
     */
    getContractEventList(endTriggerDate, eventType, page, pageSize) {
        return super.queryChain.where({eventType}).where('triggerDate', '<', endTriggerDate).where('triggerCount', 0)
            .limit(pageSize).offset((page - 1) * pageSize)
    }

    /**
     * 新增触发次数
     * @param eventId
     * @returns {Promise.<TResult>}
     */
    addTriggerCount(eventId) {
        return super.queryChain.where({eventId}).increment('triggerCount', 1).then()
    }

    /**
     * 删除已注册的事件
     * @param eventId
     */
    deleteContractEvent(condition) {
        return super.deleteOne(condition).then()
    }
}
