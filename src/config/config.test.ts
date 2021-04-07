export default () => {
    const config: any = {};

    config.cluster = {
        listen: {
            port: 5010
        }
    };

    config.mongoose = {
        url: 'mongodb://mongo-test.common:27017/events'
    };

    return config;
};
