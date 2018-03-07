'use strict'

/**
 * 本地开发配置.会与config.default进行合并
 * @param appInfo
 * @returns {{middleware: [string]}}
 */

module.exports = appInfo => {

    return {

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
                host: '39.108.77.211',
                port: 5672,
                login: 'guest',
                password: 'guest',
                authMechanism: 'AMQPLAIN'
            }
        }
    }
}