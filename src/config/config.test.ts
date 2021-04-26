import {logLevel} from 'kafkajs';

export default () => {
    const config: any = {};

    config.cluster = {
        listen: {
            port: 5010
        }
    };

    config.mongoose = {
        url: `mongodb://event_service:QzA4Qzg3QTA3NDRCQTA0NDU1RUQxMjI3MTA4ODQ1MTk=@dds-wz9ac40fee5c09441604-pub.mongodb.rds.aliyuncs.com:3717,dds-wz9ac40fee5c09442584-pub.mongodb.rds.aliyuncs.com:3717/test-events?replicaSet=mgset-44484047`
    };

    config.kafka = {
        enable: true,
        clientId: 'freelog-contract-service',
        logLevel: logLevel.ERROR,
        brokers: ['kafka-svc.common:9093']
    };

    return config;
};
