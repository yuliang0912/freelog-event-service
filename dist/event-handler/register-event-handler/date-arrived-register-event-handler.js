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
exports.DateArrivedRegisterEventHandler = void 0;
const enum_1 = require("../../enum");
const midway_1 = require("midway");
const moment = require("moment");
const date_arrived_event_register_provider_1 = require("../../app/data-provider/date-arrived-event-register-provider");
const hashed_wheel_timer_1 = require("../../hashed-wheel-timer");
const client_1 = require("../../kafka/client");
let DateArrivedRegisterEventHandler = class DateArrivedRegisterEventHandler {
    /**
     * 时间相关的事件注册
     * @param session
     * @param contractId
     * @param eventInfo
     * @param callback
     */
    async messageHandle(session, contractId, eventInfo, callback) {
        let triggerDate = eventInfo.eventTime;
        if (eventInfo.code === enum_1.ContractAllowRegisterEventEnum.AbsolutelyTimeEvent) {
            triggerDate = new Date(eventInfo.args.datetime);
        }
        if (eventInfo.code === enum_1.ContractAllowRegisterEventEnum.RelativeTimeEvent) {
            triggerDate = moment(triggerDate).add(eventInfo.args.elapsed, eventInfo.args.TIMEUNIT).toDate();
        }
        const model = {
            subjectId: contractId, triggerDate, triggerLimit: 1,
            initiatorType: enum_1.EventRegisterInitiatorTypeEnum.ContractService,
            triggerUnixTimestamp: Math.ceil(triggerDate.getTime() / 1000),
            callbackParams: eventInfo
        };
        return this.dateArrivedEventRegisterProvider.create([model], { session }).then(([eventInfo]) => {
            // 如果当天24点之前,则直接加入时间监控队列
            if (triggerDate < moment({ hour: 24 }).toDate()) {
                callback(() => this.triggerContractEvent(eventInfo));
            }
        });
    }
    /**
     * 触发合同事件
     * @param model
     */
    async triggerContractEvent(model) {
        return this.timeoutTaskTimer.addTimerTask(model._id.toString(), model.triggerDate, () => {
            this.kafkaClient.send({
                topic: 'contract-fsm-event-trigger-topic', acks: -1, messages: [{
                        key: model.subjectId.toString(), value: JSON.stringify(model.callbackParams)
                    }]
            });
        });
    }
    /**
     * 先取消注册之前的事件,再注册新的事件
     * @param session
     * @param contractId
     */
    async cancelRegister(session, contractId) {
        return this.dateArrivedEventRegisterProvider.deleteMany({
            subjectId: contractId,
            initiatorType: enum_1.EventRegisterInitiatorTypeEnum.ContractService
        }, { session });
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", client_1.KafkaClient)
], DateArrivedRegisterEventHandler.prototype, "kafkaClient", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", hashed_wheel_timer_1.TimeoutTaskTimer)
], DateArrivedRegisterEventHandler.prototype, "timeoutTaskTimer", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", date_arrived_event_register_provider_1.default)
], DateArrivedRegisterEventHandler.prototype, "dateArrivedEventRegisterProvider", void 0);
DateArrivedRegisterEventHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], DateArrivedRegisterEventHandler);
exports.DateArrivedRegisterEventHandler = DateArrivedRegisterEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hcnJpdmVkLXJlZ2lzdGVyLWV2ZW50LWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9yZWdpc3Rlci1ldmVudC1oYW5kbGVyL2RhdGUtYXJyaXZlZC1yZWdpc3Rlci1ldmVudC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHFDQUEwRjtBQUUxRixtQ0FBeUQ7QUFDekQsaUNBQWlDO0FBQ2pDLHVIQUE0RztBQUM1RyxpRUFBMEQ7QUFDMUQsK0NBQStDO0FBSS9DLElBQWEsK0JBQStCLEdBQTVDLE1BQWEsK0JBQStCO0lBU3hDOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBc0IsRUFBRSxVQUFrQixFQUFFLFNBQXdDLEVBQUUsUUFBMkI7UUFDakksSUFBSSxXQUFXLEdBQVMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUM1QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUsscUNBQThCLENBQUMsbUJBQW1CLEVBQUU7WUFDdkUsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbkQ7UUFDRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUsscUNBQThCLENBQUMsaUJBQWlCLEVBQUU7WUFDckUsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFpQixFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEg7UUFDRCxNQUFNLEtBQUssR0FBRztZQUNWLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxDQUFDO1lBQ25ELGFBQWEsRUFBRSxxQ0FBOEIsQ0FBQyxlQUFlO1lBQzdELG9CQUFvQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztZQUM3RCxjQUFjLEVBQUUsU0FBUztTQUM1QixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRTtZQUN6Rix3QkFBd0I7WUFDeEIsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQzNDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUN4RDtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLO1FBQzVCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1lBQ3BGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNsQixLQUFLLEVBQUUsa0NBQWtDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDO3dCQUM1RCxHQUFHLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO3FCQUMvRSxDQUFDO2FBQ0wsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBc0IsRUFBRSxVQUFrQjtRQUMzRCxPQUFPLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUM7WUFDcEQsU0FBUyxFQUFFLFVBQVU7WUFDckIsYUFBYSxFQUFFLHFDQUE4QixDQUFDLGVBQWU7U0FDaEUsRUFBRSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUNKLENBQUE7QUE1REc7SUFEQyxlQUFNLEVBQUU7OEJBQ0ksb0JBQVc7b0VBQUM7QUFFekI7SUFEQyxlQUFNLEVBQUU7OEJBQ1MscUNBQWdCO3lFQUFDO0FBRW5DO0lBREMsZUFBTSxFQUFFOzhCQUN5Qiw4Q0FBZ0M7eUZBQUM7QUFQMUQsK0JBQStCO0lBRjNDLGdCQUFPLEVBQUU7SUFDVCxjQUFLLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCwrQkFBK0IsQ0ErRDNDO0FBL0RZLDBFQUErQiJ9