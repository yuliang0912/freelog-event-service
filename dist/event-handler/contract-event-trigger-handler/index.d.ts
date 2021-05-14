import { KafkaClient } from '../../kafka/client';
export declare class ContractEventTriggerHandler {
    kafkaClient: KafkaClient;
    /**
     * 触发合同事件
     * @param eventInfos
     */
    triggerContractEvent(eventInfos: any[]): Promise<import("kafkajs").RecordMetadata[]>;
}
