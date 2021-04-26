import { KafkaClient } from '../../kafka/client';
export declare class ContractEventTriggerHandler {
    kafkaClient: KafkaClient;
    /**
     * 触发合同事件
     * @param eventInfo
     */
    triggerContractEvent(eventInfo: any): Promise<void>;
}
