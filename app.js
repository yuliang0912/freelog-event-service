/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

const eventSubscribe = require('./event-core/event-subscribe')

module.exports = async (app) => {

    global.eggApp = app

    await eventSubscribe.subscribeRabbit(app)
}