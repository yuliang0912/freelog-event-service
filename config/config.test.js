
'use strict'

module.exports = appInfo => {
    return {

        gatewayUrl: "http://172.18.215.224:8895",

        knex: {
            contract: {
                connection: {
                    host: 'rm-wz93t7g809kthrub7.mysql.rds.aliyuncs.com',
                    user: 'freelog_test',
                    password: 'Ff@233109',
                    database: 'fr_contract',
                },
                debug: false
            },
        },

        rabbitMq: {
            connOptions: {
                host: '172.18.215.229',
                port: 5672,
                login: 'test_user_event',
                password: 'test_user_2018',
                authMechanism: 'AMQPLAIN'
            }
        }
    }
}