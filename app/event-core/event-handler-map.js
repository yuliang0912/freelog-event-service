/**
 * 消息队列中的事件与处理函数之间映射关系
 */
'use strict'

const eventHandlerMap = {

    /**
     * 向事件中心注册事件
     */

    registerEvent: 'registerEventHandler',

    /**
     * 取消已注册的事件
     */
    unRegisterEvent: 'unRegisterEventHandler',

    /**
     * 首次激活事件
     */
    firstActiveContractEvent: 'contractEffectiveAuthEventHandler',

    /**
     * 合同结算失败事件
     */
    contractChargebackFailureEvent: 'contractChargebackFailureHandler'
}

module.exports = app => {
    return {
        execEvent(message, headers, deliveryInfo, messageObject){
            console.log('接收到事件', message)
            try {
                let eventName = headers.eventName
                if (Reflect.has(eventHandlerMap, eventName)) {
                    app.eventCore.eventHandler[Reflect.get(eventHandlerMap, eventName)].call(null, message, headers, deliveryInfo, messageObject)
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
}

