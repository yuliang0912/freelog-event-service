/**
 * Created by yuliang on 2017/9/29.
 */

'use strict'

const hashedWheelTimer = require('../extend/hashed-wheel-timer/hashed-wheel-timer')

const timer = new hashedWheelTimer(12, 5)

module.exports = {
    schedule: {
        type: 'worker',
        cron: '*/5 * * * * * *', //测试阶段30秒一个周期
    },
    async task () {
        let endDate = new Date(Date.now() + 10000)

        getData([], endDate, 1, 1).then(createTask).then(taskList => {
            taskList.forEach(task => {
                timer.newTimeout(task.timerTask, task.taskExpireTime)
            })
        })
    }
}

const getData = async (dataList, endDate, page, pageSize) => {
    return await eggApp.provider.contractEventProvider.getContractEventList(endDate, 1, page, pageSize).then(list => {
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
        return {
            taskExpireTime: new Date(item.triggerDate),
            timerTask: function () {
                console.log(item)
                eggApp.rabbitClient.publish({
                    routingKey: item.eventParams.routingKey,
                    eventName: item.eventId,
                    body: item.eventParams
                }).then(() => {
                    return eggApp.provider.contractEventProvider.addTriggerCount(item.eventId)
                }).then()
            }
        }
    })
}