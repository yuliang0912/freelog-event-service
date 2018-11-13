'use strict'

/**
 * 本地开发配置.会与config.default进行合并
 * @param appInfo
 * @returns {{middleware: [string]}}
 */

module.exports = {

    middleware: ['errorHandler', 'localUserIdentity'],

    /**
     * 本地开发环境身份信息
     */
    localIdentity: {
        userId: 10026,
        userName: "余亮",
        nickname: "烟雨落叶",
        email: "4896819@qq.com",
        mobile: "",
        tokenSn: "86cd7c43844140f2a4101b441537728f",
        userRol: 1,
        status: 1,
        createDate: "2017-10-20T16:38:17.000Z",
        updateDate: "2017-11-01T15:53:29.000Z",
        tokenType: "local"
    },

    rabbitMq: {
        connOptions: {
            host: '192.168.164.165',
            port: 5672,
            login: 'guest',
            password: 'guest',
            authMechanism: 'AMQPLAIN'
        }
    },

    logger: {
        level: 'DEBUG',
    },


    /**
     * 周期设置
     */
    cycleSetting: [
        {
            startCycleNumber: 1,
            beginDate: new Date(2018, 1, 1), //大于等于此值
            endDate: new Date(2099, 1, 1), //小于此值
            cycleIntervalMillisecond: 14400000  //4小时
        }
    ]
}