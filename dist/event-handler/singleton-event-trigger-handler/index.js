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
exports.SingletonEventTriggerHandler = void 0;
const midway_1 = require("midway");
const cycle_event_reduction_handler_1 = require("../event-data-reduction-handler/cycle-event-reduction-handler");
let SingletonEventTriggerHandler = class SingletonEventTriggerHandler {
    constructor() {
        this.consumerGroupId = 'freelog-event-service#singleton-event-handler-group';
        this.subscribeTopicName = 'freelog-singleton-event-trigger-topic';
    }
    initial() {
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * 消息处理
     * @param payload
     */
    async messageHandle(payload) {
        const { batch, resolveOffset, heartbeat } = payload;
        for (const message of batch.messages) {
            const eventInfo = JSON.parse(message.value.toString());
            switch (eventInfo.eventType) {
                case 'EndOfCycle':
                    await this.cycleEventReductionHandler.handle(eventInfo.args.cycleNumber);
                    break;
                default:
                    break;
            }
            resolveOffset(message.offset);
            await heartbeat();
        }
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", cycle_event_reduction_handler_1.CycleEventReductionHandler)
], SingletonEventTriggerHandler.prototype, "cycleEventReductionHandler", void 0);
__decorate([
    midway_1.init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SingletonEventTriggerHandler.prototype, "initial", null);
SingletonEventTriggerHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], SingletonEventTriggerHandler);
exports.SingletonEventTriggerHandler = SingletonEventTriggerHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9zaW5nbGV0b24tZXZlbnQtdHJpZ2dlci1oYW5kbGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUErRDtBQUcvRCxpSEFBeUc7QUFJekcsSUFBYSw0QkFBNEIsR0FBekMsTUFBYSw0QkFBNEI7SUFBekM7UUFFSSxvQkFBZSxHQUFHLHFEQUFxRCxDQUFDO1FBQ3hFLHVCQUFrQixHQUFHLHVDQUF1QyxDQUFDO0lBNkJqRSxDQUFDO0lBdkJHLE9BQU87UUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQXlCO1FBQ3pDLE1BQU0sRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBQyxHQUFHLE9BQU8sQ0FBQztRQUNsRCxLQUFLLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUEyQixDQUFDO1lBQ2pGLFFBQVEsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDekIsS0FBSyxZQUFZO29CQUNiLE1BQU0sSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQXFCLENBQUMsQ0FBQztvQkFDbkYsTUFBTTtnQkFDVjtvQkFDSSxNQUFNO2FBQ2I7WUFDRCxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE1BQU0sU0FBUyxFQUFFLENBQUM7U0FDckI7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQTFCRztJQURDLGVBQU0sRUFBRTs4QkFDbUIsMERBQTBCO2dGQUFDO0FBR3ZEO0lBREMsYUFBSSxFQUFFOzs7OzJEQUdOO0FBWFEsNEJBQTRCO0lBRnhDLGdCQUFPLEVBQUU7SUFDVCxjQUFLLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCw0QkFBNEIsQ0FnQ3hDO0FBaENZLG9FQUE0QiJ9