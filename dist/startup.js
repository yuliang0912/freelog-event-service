"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventServiceStartup = void 0;
const midway_1 = require("midway");
const client_1 = require("./kafka/client");
const hashed_wheel_timer_1 = require("./hashed-wheel-timer");
const register_event_handler_1 = require("./event-handler/register-event-handler");
const freelog_cycle_helper_1 = require("./extend/freelog-cycle-helper");
const singleton_event_trigger_handler_1 = require("./event-handler/singleton-event-trigger-handler");
/**
 * 事件服务启动项
 */
let EventServiceStartup = class EventServiceStartup {
    async main() {
        this.timeoutTaskTimer.startUp();
        const task1 = this.connectKafkaProducer();
        const task2 = this.subscribeKafkaTopics();
        await Promise.all([task1, task2]);
        this.freelogCycleHelper.startCycleJob();
    }
    /**
     * 连接kafka生产者
     */
    async connectKafkaProducer() {
        return this.kafkaClient.producer.connect().catch(error => {
            console.log('kafka producer connect failed,', error);
        });
    }
    /**
     * 订阅kafka主题
     */
    async subscribeKafkaTopics() {
        const topics = [this.registerEventHandler, this.singletonEventTriggerHandler];
        return this.kafkaClient.subscribes(topics).then(() => {
            console.log('kafka topic 订阅成功!');
        }).catch(error => {
            console.log('kafka topic 订阅失败!', error.toString());
        });
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", client_1.KafkaClient)
], EventServiceStartup.prototype, "kafkaClient", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", hashed_wheel_timer_1.TimeoutTaskTimer)
], EventServiceStartup.prototype, "timeoutTaskTimer", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", freelog_cycle_helper_1.FreelogCycleHelper)
], EventServiceStartup.prototype, "freelogCycleHelper", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", register_event_handler_1.RegisterEventHandler)
], EventServiceStartup.prototype, "registerEventHandler", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", singleton_event_trigger_handler_1.SingletonEventTriggerHandler)
], EventServiceStartup.prototype, "singletonEventTriggerHandler", void 0);
__decorate([
    midway_1.init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventServiceStartup.prototype, "main", null);
EventServiceStartup = __decorate([
    midway_1.provide()
], EventServiceStartup);
exports.EventServiceStartup = EventServiceStartup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGFydHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE2QztBQUM3QywyQ0FBMkM7QUFDM0MsNkRBQXNEO0FBQ3RELG1GQUE0RTtBQUM1RSx3RUFBaUU7QUFDakUscUdBQTZGO0FBRTdGOztHQUVHO0FBRUgsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFjNUIsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDMUMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxvQkFBb0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxvQkFBb0I7UUFDdEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDOUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKLENBQUE7QUF2Q0c7SUFEQyxlQUFNLEVBQUU7OEJBQ0ksb0JBQVc7d0RBQUM7QUFFekI7SUFEQyxlQUFNLEVBQUU7OEJBQ1MscUNBQWdCOzZEQUFDO0FBRW5DO0lBREMsZUFBTSxFQUFFOzhCQUNXLHlDQUFrQjsrREFBQztBQUV2QztJQURDLGVBQU0sRUFBRTs4QkFDYSw2Q0FBb0I7aUVBQUM7QUFFM0M7SUFEQyxlQUFNLEVBQUU7OEJBQ3FCLDhEQUE0Qjt5RUFBQztBQUczRDtJQURDLGFBQUksRUFBRTs7OzsrQ0FPTjtBQXBCUSxtQkFBbUI7SUFEL0IsZ0JBQU8sRUFBRTtHQUNHLG1CQUFtQixDQTBDL0I7QUExQ1ksa0RBQW1CIn0=