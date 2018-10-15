/**
 * Created by yuliang on 2017/9/15.
 */

'use strict';

require('egg').startCluster({
    baseDir: __dirname,
    port: process.env.PORT || 7010, // default to 7001
    workers: 1
});