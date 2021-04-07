import {EachBatchPayload} from 'kafkajs';

export interface IKafkaSubscribeMessageHandle {

    subscribeTopicName: string;

    consumerGroupId: string;

    messageHandle(payload: EachBatchPayload): Promise<void>;
}

export interface IContractRegisterEventMessage {
    contractId: string;
    code: string;
    service: string;
    name: string;
    eventId: string;
    eventTime: Date;
    triggerUserId: number;
    args?: {
        [paramName: string]: number | string | Date;
    };
}

export interface ISingletonEventMessage {
    eventType: 'EndOfCycle'
    args: {
        [paramName: string]: number | string | Date;
    };
}
