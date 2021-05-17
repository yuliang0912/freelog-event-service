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
const lodash_1 = require("lodash");
const contract_event_trigger_handler_1 = require("../contract-event-trigger-handler");
let DateArrivedRegisterEventHandler = class DateArrivedRegisterEventHandler {
    /**
     * 时间相关的事件注册
     * @param session
     * @param contractId
     * @param eventInfo
     */
    async messageHandle(session, contractId, eventInfo) {
        let triggerDate = eventInfo.eventTime;
        if (eventInfo.code === enum_1.ContractAllowRegisterEventEnum.AbsolutelyTimeEvent) {
            triggerDate = new Date(eventInfo.args.dateTime);
        }
        if (eventInfo.code === enum_1.ContractAllowRegisterEventEnum.RelativeTimeEvent) {
            triggerDate = moment(triggerDate).add(eventInfo.args.elapsed, eventInfo.args.timeUnit).toDate();
        }
        const model = {
            subjectId: contractId, triggerDate, triggerLimit: 1,
            initiatorType: enum_1.EventRegisterInitiatorTypeEnum.ContractService,
            triggerUnixTimestamp: Math.ceil(triggerDate.getTime() / 1000),
            callbackParams: eventInfo
        };
        return this.dateArrivedEventRegisterProvider.create([model], { session }).then(events => lodash_1.first(events));
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
    /**
     * 回调事件
     * @param events
     */
    async callbackEventHandle(events) {
        if (!events || lodash_1.isEmpty(events)) {
            return;
        }
        const currentTime = Date.now();
        const upcomingTime = currentTime + 3600000;
        const outdatedEvents = events.filter(x => x.triggerDate.getTime() <= currentTime);
        const upcomingEvents = events.filter(x => x.triggerDate.getTime() > currentTime && x.triggerDate.getTime() < upcomingTime);
        if (!lodash_1.isEmpty(outdatedEvents)) {
            await this.contractEventTriggerHandler.triggerContractEvent(outdatedEvents).then(() => {
                return this.dateArrivedEventRegisterProvider.updateMany({ _id: outdatedEvents.map(x => x._id) }, {
                    $inc: { triggerCount: 1 }, status: 2
                });
            }).catch(error => {
                return this.dateArrivedEventRegisterProvider.updateMany({ _id: outdatedEvents.map(x => x._id) }, { status: 3 });
            });
        }
        if (!lodash_1.isEmpty(upcomingEvents)) {
            for (const eventInfo of upcomingEvents) {
                this.timeoutTaskTimer.addTimerTask(eventInfo._id.toString, eventInfo.triggerDate, (taskId) => {
                    this.contractEventTriggerHandler.triggerContractEvent([eventInfo]).then(() => {
                        return this.dateArrivedEventRegisterProvider.updateOne({ _id: eventInfo._id }, {
                            $inc: { triggerCount: 1 }, status: 2
                        });
                    }).catch(error => {
                        return this.dateArrivedEventRegisterProvider.updateOne({ _id: eventInfo._id }, { status: 3 });
                    });
                });
            }
        }
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
    __metadata("design:type", contract_event_trigger_handler_1.ContractEventTriggerHandler)
], DateArrivedRegisterEventHandler.prototype, "contractEventTriggerHandler", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", date_arrived_event_register_provider_1.default)
], DateArrivedRegisterEventHandler.prototype, "dateArrivedEventRegisterProvider", void 0);
DateArrivedRegisterEventHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], DateArrivedRegisterEventHandler);
exports.DateArrivedRegisterEventHandler = DateArrivedRegisterEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hcnJpdmVkLXJlZ2lzdGVyLWV2ZW50LWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9yZWdpc3Rlci1ldmVudC1oYW5kbGVyL2RhdGUtYXJyaXZlZC1yZWdpc3Rlci1ldmVudC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHFDQUEwRjtBQUUxRixtQ0FBeUQ7QUFDekQsaUNBQWlDO0FBQ2pDLHVIQUE0RztBQUM1RyxpRUFBMEQ7QUFDMUQsK0NBQStDO0FBQy9DLG1DQUFzQztBQUN0QyxzRkFBOEU7QUFJOUUsSUFBYSwrQkFBK0IsR0FBNUMsTUFBYSwrQkFBK0I7SUFXeEM7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQXNCLEVBQUUsVUFBa0IsRUFBRSxTQUF3QztRQUNwRyxJQUFJLFdBQVcsR0FBUyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxxQ0FBOEIsQ0FBQyxtQkFBbUIsRUFBRTtZQUN2RSxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuRDtRQUNELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxxQ0FBOEIsQ0FBQyxpQkFBaUIsRUFBRTtZQUNyRSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQWlCLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNwSDtRQUNELE1BQU0sS0FBSyxHQUFHO1lBQ1YsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDbkQsYUFBYSxFQUFFLHFDQUE4QixDQUFDLGVBQWU7WUFDN0Qsb0JBQW9CLEVB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