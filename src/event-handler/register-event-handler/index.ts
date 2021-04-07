import {EachBatchPayload} from 'kafkajs';
import {init, inject, plugin, provide, scope, ScopeEnum} from 'midway';
import {ContractAllowRegisterEventEnum} from '../../enum';

import {IContractRegisterEventMessage, IKafkaSubscribeMessageHandle} from '../../interface';
import {CycleRegisterEventHandler} from './cycle-register-event-handler';
import {MongoClient} from 'mongodb';
import {DateArrivedRegisterEventHandler} from './date-arrived-register-event-handler';

@provide()
@scope(ScopeEnum.Singleton)
export class RegisterEventHandler implements IKafkaSubscribeMessageHandle {

    consumerGroupId = 'freelog-event-service#register-event-handler-group';
    subscribeTopicName = 'contract-fsm-event-register-topic';

    @plugin()
    mongoose: MongoClient;
    @inject()
    cycleRegisterEventHandler: CycleRegisterEventHandler;
    @inject()
    dateArrivedRegisterEventHandler: DateArrivedRegisterEventHandler;

    @init()
    initial() {
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * 消息处理
     * @param payload
     */
    async messageHandle(payload: EachBatchPayload): Promise<void> {
        const {batch, resolveOffset, heartbeat} = payload;
        for (const message of batch.messages) {
            const eventTime = new Date(parseInt(message.timestamp, 10));
            const contractId = message.key.toString();
            const registerEvents = JSON.parse(message.value.toString()) as IContractRegisterEventMessage[];
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
                        case ContractAllowRegisterEventEnum.EndOfCycleEvent:
                            registerTasks.push(this.cycleRegisterEventHandler.messageHandle(session, contractId, eventInfo));
                            break;
                        case ContractAllowRegisterEventEnum.RelativeTimeEvent:
                        case ContractAllowRegisterEventEnum.AbsolutelyTimeEvent:
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
}

