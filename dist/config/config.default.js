"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
exports.default = (appInfo) => {
    const config = {};
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
            ctx.body = JSON.stringify({ ret: 0, retCode: 1, msg: err.toString(), data: null });
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
        logLevel: kafkajs_1.logLevel.ERROR,
        brokers: ['192.168.164.165:9090']
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQWlDO0FBRWpDLGtCQUFlLENBQUMsT0FBbUIsRUFBRSxFQUFFO0lBQ25DLE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUV2Qix1RUFBdUU7SUFDdkUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUUsSUFBSTtTQUNiO0tBQ0osQ0FBQztJQUVGLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixNQUFNLEVBQUUsSUFBSTtRQUNaLGFBQWEsRUFBRSxPQUFPO0tBQ3pCLENBQUM7SUFFRixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsc0JBQXNCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHO1FBQ1osTUFBTSxFQUFFLEtBQUs7S0FDaEIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1lBQzlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ2pGLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLENBQUM7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE1BQU0sRUFBRTtZQUNKLE1BQU0sRUFBRSxLQUFLO1NBQ2hCO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsTUFBTSxFQUFFLEtBQUs7U0FDaEI7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLDBCQUEwQjtRQUNwQyxRQUFRLEVBQUUsa0JBQVEsQ0FBQyxLQUFLO1FBQ3hCLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO0tBQ3BDLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMifQ==