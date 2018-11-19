'use strict'

module.exports = {

    cluster: {
        listen: {port: 5010}
    },

    gatewayUrl: "http://172.18.215.224:8895/test",

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5673,
            login: 'test_user_event',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    mongoose: {
        url: "mongodb://172.18.215.231:27018/event"
    },
}