'use strict';

module.exports = appInfo => {
    const config = {
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

        gatewayUrl: "http://api.freelog.com",

        /**
         * DB-mysql相关配置
         */
        knex: {
            contract: {
                client: 'mysql',
                connection: {
                    host: '192.168.0.99',
                    user: 'root',
                    password: 'yuliang@@',
                    database: 'fr_contract',
                    charset: 'utf8',
                    timezone: '+08:00',
                    bigNumberStrings: true,
                    supportBigNumbers: true,
                    connectTimeout: 10000,
                    typeCast: (field, next) => {
                        if (field.type === 'JSON') {
                            return JSON.parse(field.string())
                        }
                        return next()
                    }
                },
                pool: {
                    max: 10, min: 2,
                    afterCreate: (conn, done) => {
                        conn.on('error', err => {
                            console.log(`mysql connection error : ${err.toString()}`)
                            err.fatal && globalInfo.app.knex.resource.client.pool.destroy(conn)
                        })
                        done()
                    }
                },
                acquireConnectionTimeout: 800,
                debug: false
            },
        },

        rabbitMq: {
            connOptions: {
                host: '192.168.164.129',
                port: 5672,
                login: 'guest',
                password: 'guest',
                authMechanism: 'AMQPLAIN'
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
                            routingKey: 'event.register.*'
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
        }
    }

    return config;
};
