/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

const path = require('path')

module.exports = async (app) => {
    app.beforeStart(async () => {
        app.loader.loadToApp(path.join(app.config.baseDir, 'app/event-core'), 'eventCore');
    })
}
