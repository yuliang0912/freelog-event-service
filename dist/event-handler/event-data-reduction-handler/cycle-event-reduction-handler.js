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
exports.CycleEventReductionHandler = void 0;
const midway_1 = require("midway");
const cycle_event_register_provider_1 = require("../../app/data-provider/cycle-event-register-provider");
const contract_event_trigger_handler_1 = require("../contract-event-trigger-handler");
let CycleEventReductionHandler = class CycleEventReductionHandler {
    /**
     * 周期结束时,查询所有当前周期需要触发的事件,然后回调触发
     * @param cycleNumber
     */
    async handle(cycleNumber) {
        console.log(`接收到周期结束事件,周期号:${cycleNumber}`);
        return this.cycleEventReductionHandle(cycleNumber);
    }
    /**
     * cycle周期结束,获取所有本次cycle需要触发的事件集,然后触发事件
     * @param cycleNumber
     * @param skip
     * @param limit
     */
    async cycleEventReductionHandle(cycleNumber, skip = 0, limit = 1000) {
        const condition = { cycleNumber: { $lte: cycleNumber }, status: 1 };
        const triggerEvents = await this.cycleEventRegisterProvider.find(condition, null, { skip, limit });
        for (const eventInfo of triggerEvents) {
            await this.contractEventTriggerHandler.triggerContractEvent(eventInfo).then();
        }
        if (triggerEvents.length === limit) {
            await this.cycleEventReductionHandle(cycleNumber, skip + limit, limit);
        }
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", cycle_event_register_provider_1.default)
], CycleEventReductionHandler.prototype, "cycleEventRegisterProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", contract_event_trigger_handler_1.ContractEventTriggerHandler)
], CycleEventReductionHandler.prototype, "contractEventTriggerHandler", void 0);
CycleEventReductionHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], CycleEventReductionHandler);
exports.CycleEventReductionHandler = CycleEventReductionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ljbGUtZXZlbnQtcmVkdWN0aW9uLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9ldmVudC1kYXRhLXJlZHVjdGlvbi1oYW5kbGVyL2N5Y2xlLWV2ZW50LXJlZHVjdGlvbi1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF5RDtBQUN6RCx5R0FBK0Y7QUFDL0Ysc0ZBQThFO0FBSTlFLElBQWEsMEJBQTBCLEdBQXZDLE1BQWEsMEJBQTBCO0lBT25DOzs7T0FHRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBbUI7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMseUJBQXlCLENBQUMsV0FBbUIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJO1FBRXZFLE1BQU0sU0FBUyxHQUFHLEVBQUMsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQztRQUNoRSxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRWpHLEtBQUssTUFBTSxTQUFTLElBQUksYUFBYSxFQUFFO1lBQ25DLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2pGO1FBQ0QsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtZQUNoQyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxRTtJQUNMLENBQUM7Q0FDSixDQUFBO0FBL0JHO0lBREMsZUFBTSxFQUFFOzhCQUNtQix1Q0FBMEI7OEVBQUM7QUFFdkQ7SUFEQyxlQUFNLEVBQUU7OEJBQ29CLDREQUEyQjsrRUFBQztBQUxoRCwwQkFBMEI7SUFGdEMsZ0JBQU8sRUFBRTtJQUNULGNBQUssQ0FBQyxrQkFBUyxDQUFDLFNBQVMsQ0FBQztHQUNkLDBCQUEwQixDQWtDdEM7QUFsQ1ksZ0VBQTBCIn0=