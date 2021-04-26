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
exports.ContractEventTriggerHandler = void 0;
const midway_1 = require("midway");
const client_1 = require("../../kafka/client");
let ContractEventTriggerHandler = class ContractEventTriggerHandler {
    /**
     * 触发合同事件
     * @param eventInfo
     */
    async triggerContractEvent(eventInfo) {
        eventInfo.callbackParams.eventTime = new Date();
        return this.kafkaClient.send({
            topic: 'contract-fsm-event-trigger-topic', acks: -1, messages: [{
                    key: eventInfo.subjectId.toString(), value: JSON.stringify(eventInfo.callbackParams)
                }]
        }).then(() => {
            eventInfo.eventTriggerSuccessful();
        }).catch(() => {
            eventInfo.eventTriggerFailed();
        });
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", client_1.KafkaClient)
], ContractEventTriggerHandler.prototype, "kafkaClient", void 0);
ContractEventTriggerHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], ContractEventTriggerHandler);
exports.ContractEventTriggerHandler = ContractEventTriggerHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9jb250cmFjdC1ldmVudC10cmlnZ2VyLWhhbmRsZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXlEO0FBQ3pELCtDQUErQztBQUkvQyxJQUFhLDJCQUEyQixHQUF4QyxNQUFhLDJCQUEyQjtJQUtwQzs7O09BR0c7SUFDSCxLQUFLLENBQUMsb0JBQW9CLENBQUMsU0FBUztRQUNoQyxTQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDekIsS0FBSyxFQUFFLGtDQUFrQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQztvQkFDNUQsR0FBRyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztpQkFDdkYsQ0FBQztTQUNMLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1QsU0FBUyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNWLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKLENBQUE7QUFsQkc7SUFEQyxlQUFNLEVBQUU7OEJBQ0ksb0JBQVc7Z0VBQUM7QUFIaEIsMkJBQTJCO0lBRnZDLGdCQUFPLEVBQUU7SUFDVCxjQUFLLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCwyQkFBMkIsQ0FxQnZDO0FBckJZLGtFQUEyQiJ9