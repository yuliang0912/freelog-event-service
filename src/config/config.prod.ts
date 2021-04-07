export default () => {
    const config: any = {};

    config.cluster = {
        listen: {
            port: 7110
        }
    };

    config.mongoose = {
        url: 'mongodb://mongo-prod.common:27017/events'
    };

    return config;
};
