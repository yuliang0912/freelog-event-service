/**
 * Created by yuliang on 2017/9/15.
 */

const eventHandler = require('./event-handler')

/**
 * 消息队列中的事件与处理函数之间映射关系
 */
const eventHandlerMap = {

    /**
     * 创建合同事件
     */
    createContractEvent: eventHandler.registerContractExpireEventHandler,

    /**
     * 首次激活事件
     */
    firstActiveContractEvent: eventHandler.contractEffectiveAuthEvent,

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
                eventHandlerMap[eventName](message, headers, deliveryInfo, messageObject)
            } else {
                console.log(`未找到事件handler,eventName:${eventName}`)
            }
        } catch (e) {
            console.error('=========event-hander-error-start==============')
            console.error(e)
            console.error('=========event-hander-error-end==============')
        }
    }
}

