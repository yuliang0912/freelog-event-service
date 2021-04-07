import {inject, provide, scope, ScopeEnum} from 'midway';
import {KafkaClient} from '../../kafka/client';

@provide()
@scope(ScopeEnum.Singleton)
export class ContractEventTriggerHandler {

    @inject()
    kafkaClient: KafkaClient;

    /**
     * 触发合同事件
     * @param eventInfo
     */
    async triggerContractEvent(eventInfo) {
        eventInfo.callbackParams.eventTime = new Date();
        return this.kafkaClient.send({
            topic: 'contract-fsm-event-trigger-topic', acks: -1, messages: [{
                key: eventInfo.subjectId.toString(), value: JSON.stringify(eventInfo.callbackParams)
            }]
        }).then(() => {
            eventInfo.eventTriggerSuccessful();
        }).catch(() => {
            eventInfo.eventTriggerFailed();
        });
    }
}
