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

            //订阅合同相关的事件注册队列
            client.subscribe('event-fsm-event-register-queue', eventRegisterHandler.execEvent)

            //订阅其他可能触发事件中心支持的事件的队列
            client.subscribe('event-subscribe-queue', eventRegisterHandler.execEvent)
        })
    }
}