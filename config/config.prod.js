/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    gatewayUrl: "http://172.18.215.224:8895",
    
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