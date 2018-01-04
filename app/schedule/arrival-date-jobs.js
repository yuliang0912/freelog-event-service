/**
 * Created by yuliang on 2017/9/29.
 */

'use strict'


const END_TIME_SPAN = 20000 //20S一个周期
const Subscription = require('egg').Subscription;
const hashedWheelTimer = require('../extend/hashed-wheel-timer/hashed-wheel-timer')
const timer = new hashedWheelTimer(12, 5)

//时间到达事件处理函数
module.exports = class arrivalDateEventHandler extends Subscription {

    static get schedule() {
        return {
            type: 'worker', // 指定一个 worker需要执行
            cron: '*/20 * * * * * *',
            //immediate: true, //立即执行一次
        };
    }

    async subscribe() {
        const provider = this.app.dataProvider
        const rabbitClient = this.app.rabbitClient

        const getData = async (dataList, endDate, page, pageSize) => {
            return await provider.contractEventProvider.getContractEventList(endDate, 1, page, pageSize).then(list => {
                if (list.length) {
                    dataList = dataList.concat(list)
                }
                if (list.length === pageSize) {
                    return getData(dataList, endDate, page + 1, pageSize)
                }
                return dataList
            })
        }

        const createTask = (dataList) => {
            return dataList.map(item => {
                console.log(item.triggerDate,Object.prototype.toString.call(item.triggerDate))
                return {
                    taskId: item.eventId,
                    taskExpireTime: new Date(item.triggerDate),
                    timerTask: function () {
                        if (item.triggerDate > new Date()) {
                            console.log('exec error', item.triggerDate, new Date())
                        }
                        rabbitClient.publish({
                            routingKey: item.eventParams.routingKey,
                            eventName: item.eventId,
                            body: item.eventParams
                        }).then((result) => {
                            if (result) {
                                return provider.contractEventProvider.addTriggerCount(item.eventId)
                            }
                        }).catch(console.error)
                    }
                }
            })
        }

        let page = 1
        let pageSize = 100
        let endDate = new Date(Date.now() + END_TIME_SPAN)

        getData([], endDate, page, pageSize).then(createTask).then(taskList => {
            taskList.forEach(task => {
                timer.newTimeout(task.taskId, task.timerTask, task.taskExpireTime)
            })
        })
    }
}

