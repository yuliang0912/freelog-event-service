/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')

module.exports = {

    /**
     * 增加次数
     * @param contractId
     * @param count
     * @param countType
     */
    addContractCount({contractId, countType}){
        return eggApp.knex.contract.raw(
            `INSERT INTO contractCount(contractId,count,countType,createDate) 
            VALUES (:contractId,:count,:countType,:createDate) 
            ON DUPLICATE KEY UPDATE count = count + 1`, {
                contractId: contractId,
                count: 1,
                countType: countType,
                createDate: moment().toDate(),
            })
    },

    /**
     * 查询数量
     * @param condition
     * @returns {Promise.<*>}
     */
    getContractCount(condition){
        if (!eggApp.type.object(condition)) {
            return Promise.reject(new Error("condition is not object"))
        }
        return eggApp.knex.contract('contractCount').where(condition).select()
    }
}