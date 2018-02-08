/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = appInfo => {
    return {

        gatewayUrl: "http://172.18.215.224:8895",

        knex: {
            contract: {
                connection: {
                    host: 'rm-wz9wj9435a0428942.mysql.rds.aliyuncs.com',
                    user: 'freelog',
                    password: 'Ff@233109',
                    database: 'fr_contract',
                },
                debug: false
            },
        },

        rabbitMq: {
            connOptions: {
                host: '172.18.215.224',
                port: 5672,
                login: 'guest',
                password: 'guest',
                authMechanism: 'AMQPLAIN'
            }
        }
    }
}