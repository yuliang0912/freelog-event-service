/**
 * Created by yuliang on 2017/9/29.
 */

'use strict'

const contractEventProvider = require('./contract-event-provider')
const contractCountProvider = require('./contract-count-provider')

module.exports = {

    registerToApp(app){
        app.provider = {
            contractEventProvider: contractEventProvider,
            contractCountProvider: contractCountProvider
        }
    },

    /**
     * 合同事件注册
     */
    contractEventProvider,

    /**
     * 合同数量统计
     */
    contractCountProvider
}