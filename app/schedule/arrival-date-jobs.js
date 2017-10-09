/**
 * Created by yuliang on 2017/9/29.
 */

'use strict'

const END_TIME_SPAN = 20000 //20S一个周期
const hashedWheelTimer = require('../extend/hashed-wheel-timer/hashed-wheel-timer')
const timer = new hashedWheelTimer(12, 5) //1分钟一圈 12个槽位,5秒间隔

const jobTask = async () => {

    let page = 1
    let pageSize = 100
    let endDate = new Date(Date.now() + END_TIME_SPAN)

    getData([], endDate, page, pageSize).then(createTask).then(taskList => {
        taskList.forEach(task => {
            timer.newTimeout(task.taskId, task.timerTask, task.taskExpireTime)
        })
    })
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
            taskId: item.eventId,
            taskExpireTime: new Date(item.triggerDate),
            timerTask: function () {
                if (item.triggerDate > new Date()) {
                    console.log('exec error', item.triggerDate, new Date())
                }
                eggApp.rabbitClient.publish({
                    routingKey: item.eventParams.routingKey,
                    eventName: item.eventId,
                    body: item.eventParams
                }).then((result) => {
                    if (result) {
                        return eggApp.provider.contractEventProvider.addTriggerCount(item.eventId)
                    }
                }).catch(console.error)
            }
        }
    })
}

module.exports.task = jobTask

//定时执行周期
module.exports.schedule = {
    type: 'worker',
    cron: '*/20 * * * * * *',
}

