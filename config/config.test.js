'use strict'

module.exports = {

    cluster: {
        listen: {port: 5010}
    },

    gatewayUrl: "http://172.18.215.224:8895/test",

    rabbitMq: {
        connOptions: {
            host: '172.18.215.229',
            port: 5672,
            login: 'test_user_event',
            password: 'test_user_2018',
            authMechanism: 'AMQPLAIN'
        }
    },

    mongoose: {
        url: "mongodb://172.18.215.229:27017/event"
    },
}