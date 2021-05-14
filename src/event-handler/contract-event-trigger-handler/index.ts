import {inject, provide, scope, ScopeEnum} from 'midway';
import {KafkaClient} from '../../kafka/client';

@provide()
@scope(ScopeEnum.Singleton)
export class ContractEventTriggerHandler {

    @inject()
    kafkaClient: KafkaClient;

    /**
     * 触发合同事件
     * @param eventInfos
     */
    async triggerContractEvent(eventInfos: any[]) {
        return this.kafkaClient.send({
            topic: 'contract-fsm-event-trigger-topic', acks: -1, messages: eventInfos.map(eventInfo => {
                eventInfo.callbackParams.eventTime = new Date();
                return {
                    key: eventInfo.subjectId.toString(), value: JSON.stringify(eventInfo.callbackParams)
                }
            })
        });
    }
}
