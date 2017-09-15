/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

module.exports = app => {

    return class ContractEventService extends app.Service {

        /**
         * 注册合同事件
         * @param model
         */
        registerContractEvent(model) {
            let {type, knex} = this.app

            if (!type.object(resource)) {
                return Promise.reject(new Error("model is not object"))
            }

            return knex.contract('contractEventRegister').insert(model)
        }
    }
}