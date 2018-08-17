/**
 * Created by yuliang on 2017/9/18.
 */

'use strict'
const moment = require('moment')
const rabbitClient = require('./helper/rabbit-mq-client')

module.exports = {

    /**
     * 时间操作库
     */
    moment,

    /**
     * 获取rabbitClient
     * @returns {*}
     */
    get rabbitClient() {
        return rabbitClient.Instance
    },
}