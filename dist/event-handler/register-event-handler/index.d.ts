import { EachMessagePayload } from 'kafkajs';
import { IKafkaSubscribeMessageHandle } from '../../interface';
import { CycleRegisterEventHandler } from './cycle-register-event-handler';
import { MongoClient } from 'mongodb';
import { DateArrivedRegisterEventHandler } from './date-arrived-register-event-handler';
export declare class RegisterEventHandler implements IKafkaSubscribeMessageHandle {
    consumerGroupId: string;
    subscribeTopicName: string;
    mongoose: MongoClient;
    cycleRegisterEventHandler: CycleRegisterEventHandler;
    dateArrivedRegisterEventHandler: DateArrivedRegisterEventHandler;
    initial(): void;
    /**
     * 消息处理
     * @param payload
     */
    messageHandle(payload: EachMessagePayload): Promise<void>;
}
