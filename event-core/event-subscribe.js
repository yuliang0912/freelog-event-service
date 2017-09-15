/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const rabbit = require('../app/extend/helper/rabbit_mq_client')
const eventRegisterHandler = require('./event-handler-map')

module.exports = {

    /**
     * 订阅rabbit消息中心
     * @param app
     * @returns {Promise.<void>}
     */
    async subscribeRabbit(app){

        await new rabbit(app.config.rabbitMq).connect().then((client) => {

            //订阅事件注册相关队列
            client.subscribe('event-contract-register', eventRegisterHandler.execEvent)

            //订阅合同创建事件队列
            client.subscribe('event-contract-create', eventRegisterHandler.execEvent)
        })
    }
}