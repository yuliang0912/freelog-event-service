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
exports.DateArrivedEventReductionHandler = void 0;
const midway_1 = require("midway");
const contract_event_trigger_handler_1 = require("../contract-event-trigger-handler");
const hashed_wheel_timer_1 = require("../../hashed-wheel-timer");
const date_arrived_event_register_provider_1 = require("../../app/data-provider/date-arrived-event-register-provider");
let DateArrivedEventReductionHandler = class DateArrivedEventReductionHandler {
    /**
     * job定时触发,然后查询最新未触发的数据,加入到列表
     * @param expirationDate
     */
    async handle(expirationDate) {
        return this.dateArrivedEventReductionHandle(expirationDate);
    }
    /**
     * 时间到达事件数据填充
     * @param expirationDate
     * @param skip
     * @param limit
     */
    async dateArrivedEventReductionHandle(expirationDate, skip = 0, limit = 1000) {
        const condition = {
            triggerDate: { $lt: expirationDate }, status: 1,
            $where: 'this.triggerCount < this.triggerLimit'
        };
        const triggerEvents = await this.dateArrivedEventRegisterProvider.find(condition, null, {
            skip, limit, sort: { _id: 1 }
        });
        for (const eventInfo of triggerEvents) {
            this.timeoutTaskTimer.addTimerTask(eventInfo._id, eventInfo.triggerDate, () => {
                this.contractEventTriggerHandler.triggerContractEvent([eventInfo]).then(() => {
                    eventInfo.eventTriggerSuccessful();
                }).catch(error => {
                    eventInfo.eventTriggerFailed();
                });
            });
        }
        if (triggerEvents.length === limit) {
            await this.dateArrivedEventReductionHandle(expirationDate, skip + limit, limit);
        }
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", hashed_wheel_timer_1.TimeoutTaskTimer)
], DateArrivedEventReductionHandler.prototype, "timeoutTaskTimer", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", contract_event_trigger_handler_1.ContractEventTriggerHandler)
], DateArrivedEventReductionHandler.prototype, "contractEventTriggerHandler", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", date_arrived_event_register_provider_1.default)
], DateArrivedEventReductionHandler.prototype, "dateArrivedEventRegisterProvider", void 0);
DateArrivedEventReductionHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], DateArrivedEventReductionHandler);
exports.DateArrivedEventReductionHandler = DateArrivedEventReductionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hcnJpdmVkLWV2ZW50LXJlZHVjdGlvbi1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V2ZW50LWhhbmRsZXIvZXZlbnQtZGF0YS1yZWR1Y3Rpb24taGFuZGxlci9kYXRlLWFycml2ZWQtZXZlbnQtcmVkdWN0aW9uLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXlEO0FBQ3pELHNGQUE4RTtBQUM5RSxpRUFBMEQ7QUFDMUQsdUhBQTRHO0FBSTVHLElBQWEsZ0NBQWdDLEdBQTdDLE1BQWEsZ0NBQWdDO0lBU3pDOzs7T0FHRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBb0I7UUFDN0IsT0FBTyxJQUFJLENBQUMsK0JBQStCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLCtCQUErQixDQUFDLGNBQW9CLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSTtRQUM5RSxNQUFNLFNBQVMsR0FBRztZQUNkLFdBQVcsRUFBRSxFQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUM3QyxNQUFNLEVBQUUsdUNBQXVDO1NBQ2xELENBQUM7UUFDRixNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRTtZQUNwRixJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUM7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxNQUFNLFNBQVMsSUFBSSxhQUFhLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUMxRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ3pFLFNBQVMsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2IsU0FBUyxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ25DLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUNELElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUU7WUFDaEMsTUFBTSxJQUFJLENBQUMsK0JBQStCLENBQUMsY0FBYyxFQUFFLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkY7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQXpDRztJQURDLGVBQU0sRUFBRTs4QkFDUyxxQ0FBZ0I7MEVBQUM7QUFFbkM7SUFEQyxlQUFNLEVBQUU7OEJBQ29CLDREQUEyQjtxRkFBQztBQUV6RDtJQURDLGVBQU0sRUFBRTs4QkFDeUIsOENBQWdDOzBGQUFDO0FBUDFELGdDQUFnQztJQUY1QyxnQkFBTyxFQUFFO0lBQ1QsY0FBSyxDQUFDLGtCQUFTLENBQUMsU0FBUyxDQUFDO0dBQ2QsZ0NBQWdDLENBNEM1QztBQTVDWSw0RUFBZ0MifQ==