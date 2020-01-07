'use strict'

module.exports = {

    cluster: {
        listen: {port: 5010}
    },

    rabbitMq: {
        connOptions: {
            host: 'rabbitmq-test.common',
            port: 5672,
            login: 'test_user_event',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    mongoose: {
        url: "mongodb://172.18.215.231:27018/event"
    },
}