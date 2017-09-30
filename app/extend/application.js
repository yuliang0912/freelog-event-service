/**
 * Created by yuliang on 2017/9/18.
 */

'use strict'
const moment = require('moment')
const eventCountType = require('../enum/event-count-type')
const eventRegisterType = require('../enum/event-register-type')
const rabbitClient = require('./helper/rabbit_mq_client')

module.exports = {

    /**
     * 时间操作库
     */
    moment,

    /**
     * 合同数量统计类型
     */
    eventCountType,

    /**
     * 事件注册类型
     */
    eventRegisterType,

    /**
     * 获取rabbitClient
     * @returns {*}
     */
    get rabbitClient() {
        return rabbitClient.Instance
    },
}