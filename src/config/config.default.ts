import {EggAppInfo} from 'midway';
import {logLevel} from 'kafkajs';

export default (appInfo: EggAppInfo) => {
    const config: any = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name;

    config.cluster = {
        listen: {
            port: 7110
        }
    };

    config.i18n = {
        enable: true,
        defaultLocale: 'zh-CN'
    };

    config.middleware = ['errorAutoSnapHandler', 'gatewayIdentityInfoHandler'];

    config.static = {
        enable: false
    };

    config.onerror = {
        all(err, ctx) {
            ctx.type = 'application/json';
            ctx.body = JSON.stringify({ret: 0, retCode: 1, msg: err.toString(), data: null});
            ctx.status = 500;
        }
    };

    config.security = {
        xframe: {
            enable: false,
        },
        csrf: {
            enable: false,
        }
    };

    config.kafka = {
        enable: true,
        clientId: 'freelog-contract-service',
        logLevel: logLevel.ERROR,
        brokers: ['192.168.164.165:9090']
    };

    return config;
};
