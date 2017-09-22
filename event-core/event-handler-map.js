/**
 * Created by yuliang on 2017/9/15.
 */

const eventHandler = require('./event-handler')

/**
 * 消息队列中的事件与处理函数之间映射关系
 */
const eventHandlerMap = {

    /**
     * 向事件中心注册事件
     */
    registerEvent: eventHandler.registerEventHandler,

    /**
     * 取消已注册的事件
     */
    unRegisterEvent: eventHandler.unRegisterEventHandler,

    /**
     * 首次激活事件
     */
    firstActiveContractEvent: eventHandler.contractEffectiveAuthEventHandler,

    /**
     * 合同超时未执行事件
     */
    contractTimeoutEvent: eventHandler.contractTimeoutHandler,

    /**
     * 合同结算失败事件
     */
    contractChargebackFailureEvent: eventHandler.contractChargebackFailureHandler
}


module.exports = {
    execEvent(message, headers, deliveryInfo, messageObject){
        try {
            let eventName = headers.eventName
            if (Reflect.has(eventHandlerMap, eventName)) {
                Reflect.get(eventHandlerMap, eventName).call(null, message, headers, deliveryInfo, messageObject)
            } else {
                console.log(`未找到事件handler,eventName:${eventName}`)
                messageObject.acknowledge(false)
            }
        } catch (e) {
            console.error('=========event-hander-error-start==============')
            console.error(e)
            console.error('=========event-hander-error-end==============')
        }
    }
}

