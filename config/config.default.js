'use strict';

module.exports = appInfo => {
    const config = {

        cluster: {
            listen: {port: 7010}
        },

        keys: '20ab72d9397ff78c5058a106c635f008',

        i18n: {
            enable: false
        },

        /**
         * 关闭安全防护
         */
        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: false,
            }
        },

        ua: {
            enable: true
        },

        bodyParser: {
            enable: true,
        },

        middleware: ['errorHandler'],

        /**
         * mongoDB配置
         */
        mongo: {
            uri: 'mongodb://192.168.0.99:27017/auth'
        },

        /**
         * 上传文件相关配置
         */
        uploadConfig: {
            aliOss: {
                enable: true,
                accessKeyId: 'LTAIy8TOsSnNFfPb',
                accessKeySecret: 'Bt5yMbW89O7wMTVQsNUfvYfou5GPsL',
                bucket: 'freelog-shenzhen',
                internal: false,
                region: 'oss-cn-shenzhen',
                timeout: 180000
            },
            amzS3: {}
        },

        multipart: {
            autoFields: true,
            defaultCharset: 'utf8',
            fieldNameSize: 100,
            fieldSize: '100kb',
            fields: 10,
            fileSize: '100mb',
            files: 10,
            fileExtensions: [],
            whitelist: (fileName) => true,
        },

        freelogBase: {
            retCodeEnum: {},
            errCodeEnum: {}
        },

        logger : {level: "DEBUG"},

        gatewayUrl: "http://api.freelog.com",

        mongoose: {
            url: "mongodb://127.0.0.1:27017/event"
        },

        rabbitMq: {
            connOptions: {
                host: '192.168.164.129',
                port: 5672,
                login: 'guest',
                password: 'guest',
                authMechanism: 'AMQPLAIN',
                heartbeat: 120  //每2分钟保持一次连接
            },
            implOptions: {
                reconnect: true,
                reconnectBackoffTime: 10000  //10秒尝试连接一次
            },
            exchange: {
                name: 'freelog-event-exchange'
            },
            queues: [
                {
                    name: 'event-fsm-event-register-queue',
                    options: {autoDelete: false, durable: true},
                    routingKeys: [
                        {
                            exchange: 'freelog-contract-exchange',
                            routingKey: 'contract.event.register'
                        },
                        {
                            exchange: 'freelog-contract-exchange',
                            routingKey: 'contract.event.unregister'
                        }
                    ]
                },
                {
                    name: 'event-subscribe-queue',
                    options: {autoDelete: false, durable: true},
                    routingKeys: [
                        {
                            exchange: 'freelog-contract-exchange',
                            routingKey: 'contract.active.contract'
                        }
                    ]
                }
            ]
        },

        /**
         * 周期设置
         */
        cycleSetting: [
            {
                startCycleNumber: 1,
                beginDate: new Date(2018, 1, 1), //大于等于此值
                endDate: new Date(2019, 1, 1), //小于此值
                cycleIntervalMillisecond: 14400000  //4hour
            },
            {
                startCycleNumber: 2191,
                beginDate: new Date(2019, 1, 1),
                endDate: new Date(2029, 12, 31, 23, 59, 59),
                cycleIntervalMillisecond: 14400000  //4hour
            }
        ],

        customLoader: [
            {name: 'eventHandler', dir: 'app/event-handler'},
            {name: 'timerCycleService', dir: 'app/cycle-timer-service'},
            {name: 'mqSubscribe', dir: 'app/mq-subscribe'},
        ]
    }

    return config;
};
