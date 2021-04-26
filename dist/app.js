"use strict";
// import {KafkaStartup} from "./kafka/startup";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("egg-freelog-base/database/mongoose");
/**
 * https://eggjs.org/zh-cn/basics/app-start.html
 */
class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async willReady() {
        await mongoose_1.default(this.app).then(() => {
            return this.app.applicationContext.getAsync('eventServiceStartup');
        });
    }
    async beforeClose() {
        const kafkaClient = await this.app.applicationContext.getAsync('kafkaClient');
        await kafkaClient.disconnect();
    }
}
exports.default = AppBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZ0RBQWdEOztBQUtoRCxpRUFBMEQ7QUFFMUQ7O0dBRUc7QUFDSCxNQUFxQixXQUFXO0lBSTVCLFlBQVksR0FBdUI7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTO1FBQ1gsTUFBTSxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVztRQUNiLE1BQU0sV0FBVyxHQUFnQixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQWxCRCw4QkFrQkMifQ==