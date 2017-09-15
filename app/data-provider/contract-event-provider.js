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
    getContractEvents(condition) {
        if (!eggApp.type.object(condition)) {
            return Promise.reject(new Error("condition is not object"))
        }
        return eggApp.knex.contract('contractEventRegister').where(condition).select()
    }
}