/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const moment = require('moment')
const KnexBaseOperation = require('egg-freelog-database/lib/database/knex-base-operation')

module.exports = class ContractCountProvider extends KnexBaseOperation {

    constructor(app) {
        super(app.knex.contract('contractCount'))
        this.app = app
        this.contractKnex = app.knex.contract
    }

    /**
     * 增加次数
     * @param contractId
     * @param count
     * @param countType
     */
    addContractCount({contractId, countType}) {

        let sql = `INSERT INTO contractCount(contractId,count,countType,createDate) 
            VALUES (:contractId,:count,:countType,:createDate) 
            ON DUPLICATE KEY UPDATE count = count + 1`

        return this.contractKnex.raw(sql, {
            contractId: contractId,
            count: 1,
            countType: countType,
            createDate: moment().toDate(),
        })
    }

    /**
     * 查询数量
     * @param condition
     * @returns {Promise.<*>}
     */
    getContractCount(condition) {
        return super.findOne(condition)
    }
}