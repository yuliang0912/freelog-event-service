/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

const eventSubscribe = require('./event-core/event-subscribe')

module.exports = async (app) => {

    app.on('error', (err, ctx) => {
        if (!err || !ctx) {
            return
        }

        ctx.body = ctx.buildReturnObject(app.retCodeEnum.serverError,
            app.errCodeEnum.autoSnapError,
            err.message || err.toString())
    })

    global.eggApp = app

    await eventSubscribe.subscribeRabbit(app)
}