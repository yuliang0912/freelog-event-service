/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')

module.exports = app => {

    let {type, knex} = app

    return {
        /**
         * 增加次数
         * @param contractId
         * @param count
         * @param countType
         */
        addContractCount({contractId, countType}){

            let sql = `INSERT INTO contractCount(contractId,count,countType,createDate) 
            VALUES (:contractId,:count,:countType,:createDate) 
            ON DUPLICATE KEY UPDATE count = count + 1`

            return knex.contract.raw(sql, {
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
            if (!type.object(condition)) {
                return Promise.reject(new Error("condition is not object"))
            }
            return knex.contract('contractCount').where(condition).select()
        }
    }
}