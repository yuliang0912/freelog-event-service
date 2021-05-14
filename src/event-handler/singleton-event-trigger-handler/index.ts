import {init, inject, provide, scope, ScopeEnum} from 'midway';
import {IKafkaSubscribeMessageHandle, ISingletonEventMessage} from '../../interface';
import {EachMessagePayload} from 'kafkajs';
import {CycleEventReductionHandler} from '../event-data-reduction-handler/cycle-event-reduction-handler';

@provide()
@scope(ScopeEnum.Singleton)
export class SingletonEventTriggerHandler implements IKafkaSubscribeMessageHandle {

    consumerGroupId = 'freelog-event-service#singleton-event-handler-group';
    subscribeTopicName = 'freelog-singleton-event-trigger-topic';

    @inject()
    cycleEventReductionHandler: CycleEventReductionHandler;

    @init()
    initial() {
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * 消息处理
     * @param payload
     */
    async messageHandle(payload: EachMessagePayload): Promise<void> {
        const {message} = payload;
        const eventInfo = JSON.parse(message.value.toString()) as ISingletonEventMessage;
        switch (eventInfo.eventType) {
            case 'EndOfCycle':
                await this.cycleEventReductionHandler.handle(eventInfo.args.cycleNumber as number);
                break;
            default:
                break;
        }
    }
}
