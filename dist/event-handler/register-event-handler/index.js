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
        const { batch, resolveOffset, heartbeat } = payload;
        for (const message of batch.messages) {
            const eventTime = new Date(parseInt(message.timestamp, 10));
            const contractId = message.key.toString();
            const registerEvents = JSON.parse(message.value.toString());
            const session = await this.mongoose.startSession();
            const callbacks = [];
            const callback = (func) => callbacks.push(func);
            await session.withTransaction(() => {
                const registerTasks = [];
                registerTasks.push(this.cycleRegisterEventHandler.cancelRegister(session, contractId));
                registerTasks.push(this.dateArrivedRegisterEventHandler.cancelRegister(session, contractId));
                for (const eventInfo of registerEvents) {
                    eventInfo.eventTime = eventTime;
                    eventInfo.contractId = contractId;
                    switch (eventInfo.code) {
                        case enum_1.ContractAllowRegisterEventEnum.EndOfCycleEvent:
                            registerTasks.push(this.cycleRegisterEventHandler.messageHandle(session, contractId, eventInfo));
                            break;
                        case enum_1.ContractAllowRegisterEventEnum.RelativeTimeEvent:
                        case enum_1.ContractAllowRegisterEventEnum.AbsolutelyTimeEvent:
                            registerTasks.push(this.dateArrivedRegisterEventHandler.messageHandle(session, contractId, eventInfo, callback));
                            break;
                        default:
                            break;
                    }
                }
                return Promise.all(registerTasks);
            }).then(() => {
                callbacks.forEach(callback => callback());
                resolveOffset(message.offset);
            }).finally(() => {
                session.endSession();
            });
            await heartbeat();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZlbnQtaGFuZGxlci9yZWdpc3Rlci1ldmVudC1oYW5kbGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1DQUF1RTtBQUN2RSxxQ0FBMEQ7QUFHMUQsaUZBQXlFO0FBQ3pFLHFDQUFvQztBQUNwQywrRkFBc0Y7QUFJdEYsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFBakM7UUFFSSxvQkFBZSxHQUFHLG9EQUFvRCxDQUFDO1FBQ3ZFLHVCQUFrQixHQUFHLG1DQUFtQyxDQUFDO0lBd0Q3RCxDQUFDO0lBOUNHLE9BQU87UUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQXlCO1FBQ3pDLE1BQU0sRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBQyxHQUFHLE9BQU8sQ0FBQztRQUNsRCxLQUFLLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzFDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBb0MsQ0FBQztZQUMvRixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sT0FBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFDekIsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN2RixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdGLEtBQUssTUFBTSxTQUFTLElBQUksY0FBYyxFQUFFO29CQUNwQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDaEMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7b0JBQ2xDLFFBQVEsU0FBUyxDQUFDLElBQUksRUFBRTt3QkFDcEIsS0FBSyxxQ0FBOEIsQ0FBQyxlQUFlOzRCQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUNqRyxNQUFNO3dCQUNWLEtBQUsscUNBQThCLENBQUMsaUJBQWlCLENBQUM7d0JBQ3RELEtBQUsscUNBQThCLENBQUMsbUJBQW1COzRCQUNuRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDakgsTUFBTTt3QkFDVjs0QkFDSSxNQUFNO3FCQUNiO2lCQUNKO2dCQUNELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQVEsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNULFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUMxQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxTQUFTLEVBQUUsQ0FBQztTQUNyQjtJQUNMLENBQUM7Q0FDSixDQUFBO0FBckRHO0lBREMsZUFBTSxFQUFFOzhCQUNDLHFCQUFXO3NEQUFDO0FBRXRCO0lBREMsZUFBTSxFQUFFOzhCQUNrQix3REFBeUI7dUVBQUM7QUFFckQ7SUFEQyxlQUFNLEVBQUU7OEJBQ3dCLHFFQUErQjs2RUFBQztBQUdqRTtJQURDLGFBQUksRUFBRTs7OzttREFHTjtBQWZRLG9CQUFvQjtJQUZoQyxnQkFBTyxFQUFFO0lBQ1QsY0FBSyxDQUFDLGtCQUFTLENBQUMsU0FBUyxDQUFDO0dBQ2Qsb0JBQW9CLENBMkRoQztBQTNEWSxvREFBb0IifQ==