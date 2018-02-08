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
        };
    }

    async subscribe() {
        let page = 1
        let pageSize = 100
        let endDate = new Date(Date.now() + END_TIME_SPAN)

        this.getData([], endDate, page, pageSize).then((dataList) => {
            return this.createTask(dataList)
        }).then(taskList => {
            taskList.forEach(task => {
                timer.newTimeout(task.taskId, task.timerTask, task.taskExpireTime)
            })
        })
    }

    async getData(dataList, endDate, page, pageSize) {
        return await this.app.dal.contractEventProvider.getContractEventList(endDate, 1, page, pageSize).then(list => {
            if (list.length) {
                dataList = dataList.concat(list)
            }
            if (list.length === pageSize) {
                return this.getData(dataList, endDate, page + 1, pageSize)
            }
            return dataList
        })
    }

    createTask(dataList) {
        let {rabbitClient, dal} = this.app
        return dataList.map(item => {
            return {
                taskId: item.eventId,
                taskExpireTime: new Date(item.triggerDate),
                timerTask: function () {
                    console.log(item)
                    rabbitClient.publish({
                        routingKey: item.eventParams.routingKey,
                        eventName: item.eventId,
                        body: item.eventParams
                    }).then((result) => {
                        if (result) {
                            return dal.contractEventProvider.addTriggerCount(item.eventId)
                        }
                    }).catch(console.error)
                }
            }
        })
    }
}

