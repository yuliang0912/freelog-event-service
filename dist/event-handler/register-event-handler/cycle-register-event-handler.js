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
exports.CycleRegisterEventHandler = void 0;
const midway_1 = require("midway");
const cycle_event_register_provider_1 = require("../../app/data-provider/cycle-event-register-provider");
const moment = require("moment");
const freelog_cycle_helper_1 = require("../../extend/freelog-cycle-helper");
const enum_1 = require("../../enum");
let CycleRegisterEventHandler = class CycleRegisterEventHandler {
    /**
     * 周期注册事件处理
     * @param session
     * @param contractId
     * @param eventInfo
     */
    async messageHandle(session, contractId, eventInfo) {
        const { cycleCount, cycleUnit } = eventInfo.args;
        const eventApplyDate = this.getEventApplyDate(eventInfo.eventTime, cycleCount, cycleUnit);
        const cycleNumber = this.freelogCycleHelper.getCycleNumber(eventApplyDate);
        const model = {
            subjectId: contractId,
            initiatorType: enum_1.EventRegisterInitiatorTypeEnum.ContractService,
            cycleNumber, triggerLimit: 1,
            callbackParams: eventInfo
        };
        return this.cycleEventRegisterProvider.create([model], { session });
    }
    /**
     * 先取消注册之前的事件,再注册新的事件
     * @param session
     * @param contractId
     */
    async cancelRegister(session, contractId) {
        return this.cycleEventRegisterProvider.deleteMany({
            subjectId: contractId,
            initiatorType: enum_1.EventRegisterInitiatorTypeEnum.ContractService
        }, { session });
    }
    /**
     * 获取事件调用时间
     * @param eventTime
     * @param cycleCount
     * @param cycleUnit
     */
    getEventApplyDate(eventTime, cycleCount, cycleUnit) {
        if (!['cycles', 'cycle'].includes(cycleUnit?.toLocaleLowerCase())) {
            return moment(eventTime).add(cycleCount ?? 1, cycleUnit).toDate();
        }
        return moment(eventTime).add((cycleCount ?? 1) * 4, 'hours').toDate();
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", freelog_cycle_helper_1.FreelogCycleHelper)
], CycleRegisterEventHandler.prototype, "freelogCycleHelper", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", cycle_event_register_provider_1.default)
], CycleRegisterEventHandler.prototype, "cycleEventRegisterProvider", void 0);
CycleRegisterEventHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], CycleRegisterEventHandler);
exports.CycleRegisterEventHandler = CycleRegisterEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ljbGUtcmVnaXN0ZXItZXZlbnQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ldmVudC1oYW5kbGVyL3JlZ2lzdGVyLWV2ZW50LWhhbmRsZXIvY3ljbGUtcmVnaXN0ZXItZXZlbnQtaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBeUQ7QUFHekQseUdBQStGO0FBQy9GLGlDQUFpQztBQUNqQyw0RUFBcUU7QUFDckUscUNBQTBEO0FBSTFELElBQWEseUJBQXlCLEdBQXRDLE1BQWEseUJBQXlCO0lBT2xDOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFzQixFQUFFLFVBQWtCLEVBQUUsU0FBd0M7UUFDcEcsTUFBTSxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQy9DLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFVBQW9CLEVBQUUsU0FBZ0IsQ0FBQyxDQUFDO1FBQzNHLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0UsTUFBTSxLQUFLLEdBQUc7WUFDVixTQUFTLEVBQUUsVUFBVTtZQUNyQixhQUFhLEVBQUUscUNBQThCLENBQUMsZUFBZTtZQUM3RCxXQUFXLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDNUIsY0FBYyxFQUFFLFNBQVM7U0FDNUIsQ0FBQTtRQUNELE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBc0IsRUFBRSxVQUFrQjtRQUMzRCxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxVQUFVLENBQUM7WUFDOUMsU0FBUyxFQUFFLFVBQVU7WUFDckIsYUFBYSxFQUFFLHFDQUE4QixDQUFDLGVBQWU7U0FDaEUsRUFBRSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsaUJBQWlCLENBQUMsU0FBZSxFQUFFLFVBQWtCLEVBQUUsU0FBMkQ7UUFDOUcsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFO1lBQy9ELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFLFNBQWdCLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUM1RTtRQUNELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUUsQ0FBQztDQUNKLENBQUE7QUEvQ0c7SUFEQyxlQUFNLEVBQUU7OEJBQ1cseUNBQWtCO3FFQUFDO0FBRXZDO0lBREMsZUFBTSxFQUFFOzhCQUNtQix1Q0FBMEI7NkVBQUM7QUFMOUMseUJBQXlCO0lBRnJDLGdCQUFPLEVBQUU7SUFDVCxjQUFLLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCx5QkFBeUIsQ0FrRHJDO0FBbERZLDhEQUF5QiJ9