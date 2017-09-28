/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

const hashedWheelTimer = require('./app/extend/hashed-wheel-timer/hashed-wheel-timer')
const eventSubscribe = require('./event-core/event-subscribe')

module.exports = async (app) => {

    global.eggApp = app

    var timer = new hashedWheelTimer(5, 2)

    timer.newTimeout(function () {
        console.log(new Date() + " 任务1")
    }, new Date(Date.now() + 15000))

    timer.newTimeout(function () {
        console.log(new Date() + " 任务2")
    }, new Date(Date.now() + 25000))

    timer.newTimeout(function () {
        console.log(new Date() + " 任务3")
    }, new Date(Date.now() + 26000))
    timer.newTimeout(function () {
        console.log(new Date() + " 任务4")
    }, new Date(Date.now() + 27000))

    await eventSubscribe.subscribeRabbit(app)
}