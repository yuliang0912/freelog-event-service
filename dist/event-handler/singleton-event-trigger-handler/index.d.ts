import { IKafkaSubscribeMessageHandle } from '../../interface';
import { EachBatchPayload } from 'kafkajs';
import { CycleEventReductionHandler } from '../event-data-reduction-handler/cycle-event-reduction-handler';
export declare class SingletonEventTriggerHandler implements IKafkaSubscribeMessageHandle {
    consumerGroupId: string;
    subscribeTopicName: string;
    cycleEventReductionHandler: CycleEventReductionHandler;
    initial(): void;
    /**
     * 消息处理
     * @param payload
     */
    messageHandle(payload: EachBatchPayload): Promise<void>;
}
