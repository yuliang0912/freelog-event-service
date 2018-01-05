/**
 * Created by yuliang on 2017/9/15.
 */

'use strict'

const rabbit = require('../extend/helper/rabbit_mq_client')

module.exports = async app => {
    await new rabbit(app.config.rabbitMq).connect().then((client) => {

        //订阅合同相关的事件注册队列
        client.subscribe('event-fsm-event-register-queue', app.eventCore.eventHandlerMap.execEvent)

        //订阅其他可能触发事件中心支持的事件的队列
        client.subscribe('event-subscribe-queue', app.eventCore.eventHandlerMap.execEvent)
    }).catch(err => {
        console.log(err)
    })
}