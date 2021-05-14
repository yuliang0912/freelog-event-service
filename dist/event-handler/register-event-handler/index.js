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
exports.RegisterEventHandler = void 0;
const midway_1 = require("midway");
const enum_1 = require("../../enum");
const cycle_register_event_handler_1 = require("./cycle-register-event-handler");
const mongodb_1 = require("mongodb");
const date_arrived_register_event_handler_1 = require("./date-arrived-register-event-handler");
let RegisterEventHandler = class RegisterEventHandler {
    constructor() {
        this.consumerGroupId = 'freelog-event-service#register-event-handler-group';
        this.subscribeTopicName = 'contract-fsm-event-register-topic';
    }
    initial() {
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * 消息处理
     * @param payload
     */
    async messageHandle(payload) {
        const { message } = payload;
        const eventTime = new Date(parseInt(message.timestamp, 10));
        const contractId = message.key.toString();
        const registerEvents = JSON.parse(message.value.toString());
        const timeEvents = [];
        const session = await this.mongoose.startSession();
        await session.withTransaction(async () => {
            const registerTasks = [];
            registerTasks.push(this.cycleRegisterEventHandler.cancelRegister(session, contractId));
            registerTasks.push(this.dateArrivedRegisterEventHandler.cancelRegister(session, contractId));
            await Promise.all(registerTasks);
            for (const eventInfo of registerEvents) {
                eventInfo.eventTime = eventTime;
                eventInfo.contractId = contractId;
                switch (eventInfo.code) {
                    case enum_1.ContractAllowRegisterEventEnum.EndOfCycleEvent:
                        await this.cycleRegisterEventHandler.messageHandle(session, contractId, eventInfo);
                        break;
                    case enum_1.ContractAllowRegisterEventEnum.RelativeTimeEvent:
                    case enum_1.ContractAllowRegisterEventEnum.AbsolutelyTimeEvent:
                        await this.dateArrivedRegisterEventHandler.messageHandle(session, contractId, eventInfo).then(x => timeEvents.push(x));
                        break;
                    default:
                        break;
                }
            }
        }).finally(() => {
            session.endSession();
        });
        return this.dateArrivedRegisterEventHandler.callbackEventHandle(timeEvents);
    }
};
__decorate([
    midway_1.plugin(),
    __metadata("design:type", mongodb_1.MongoClient)
], RegisterEventHandler.prototype, "mongoose", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", cycle_register_event_handler_1.CycleRegisterEventHandler)
], RegisterEventHandler.prototype, "cycleRegisterEventHandler", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", date_arrived_register_event_handler_1.DateArrivedRegisterEventHandler)
], RegisterEventHandler.prototype, "dateArrivedRegisterEventHandler", void 0);
__decorate([
    midway_1.init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RegisterEventHandler.prototype, "initial", null);
RegisterEventHandler = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], RegisterEventHandler);
exports.RegisterEventHandler = RegisterEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9yZWdpc3Rlci1ldmVudC1oYW5kbGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1DQUF1RTtBQUN2RSxxQ0FBMEQ7QUFHMUQsaUZBQXlFO0FBQ3pFLHFDQUFvQztBQUNwQywrRkFBc0Y7QUFJdEYsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFBakM7UUFFSSxvQkFBZSxHQUFHLG9EQUFvRCxDQUFDO1FBQ3ZFLHVCQUFrQixHQUFHLG1DQUFtQyxDQUFDO0lBa0Q3RCxDQUFDO0lBeENHLE9BQU87UUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQTJCO1FBQzNDLE1BQU0sRUFBQyxPQUFPLEVBQUMsR0FBRyxPQUFPLENBQUM7UUFDMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBb0MsQ0FBQztRQUMvRixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ25ELE1BQU0sT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNyQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFDekIsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3ZGLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM3RixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakMsS0FBSyxNQUFNLFNBQVMsSUFBSSxjQUFjLEVBQUU7Z0JBQ3BDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUNoQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztnQkFDbEMsUUFBUSxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUNwQixLQUFLLHFDQUE4QixDQUFDLGVBQWU7d0JBQy9DLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUNuRixNQUFNO29CQUNWLEtBQUsscUNBQThCLENBQUMsaUJBQWlCLENBQUM7b0JBQ3RELEtBQUsscUNBQThCLENBQUMsbUJBQW1CO3dCQUNuRCxNQUFNLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZILE1BQU07b0JBQ1Y7d0JBQ0ksTUFBTTtpQkFDYjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDLCtCQUErQixDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Q0FDSixDQUFBO0FBL0NHO0lBREMsZUFBTSxFQUFFOzhCQUNDLHFCQUFXO3NEQUFDO0FBRXRCO0lBREMsZUFBTSxFQUFFOzhCQUNrQix3REFBeUI7dUVBQUM7QUFFckQ7SUFEQyxlQUFNLEVBQUU7OEJBQ3dCLHFFQUErQjs2RUFBQztBQUdqRTtJQURDLGFBQUksRUFBRTs7OzttREFHTjtBQWZRLG9CQUFvQjtJQUZoQyxnQkFBTyxFQUFFO0lBQ1QsY0FBSyxDQUFDLGtCQUFTLENBQUMsU0FBUyxDQUFDO0dBQ2Qsb0JBQW9CLENBcURoQztBQXJEWSxvREFBb0IifQ==