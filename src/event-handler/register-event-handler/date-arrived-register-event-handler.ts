import {ClientSession} from 'mongodb';
import {ContractAllowRegisterEventEnum, EventRegisterInitiatorTypeEnum} from '../../enum';
import {IContractRegisterEventMessage} from '../../interface';
import {inject, provide, scope, ScopeEnum} from 'midway';
import * as moment from 'moment';
import DateArrivedEventRegisterProvider from '../../app/data-provider/date-arrived-event-register-provider';
import {TimeoutTaskTimer} from '../../hashed-wheel-timer';
import {KafkaClient} from '../../kafka/client';

@provide()
@scope(ScopeEnum.Singleton)
export class DateArrivedRegisterEventHandler {

    @inject()
    kafkaClient: KafkaClient;
    @inject()
    timeoutTaskTimer: TimeoutTaskTimer;
    @inject()
    dateArrivedEventRegisterProvider: DateArrivedEventRegisterProvider;

    /**
     * 时间相关的事件注册
     * @param session
     * @param contractId
     * @param eventInfo
     * @param callback
     */
    async messageHandle(session: ClientSession, contractId: string, eventInfo: IContractRegisterEventMessage, callback: (...args) => void): Promise<void> {
        let triggerDate: Date = eventInfo.eventTime;
        if (eventInfo.code === ContractAllowRegisterEventEnum.AbsolutelyTimeEvent) {
            triggerDate = new Date(eventInfo.args.datetime);
        }
        if (eventInfo.code === ContractAllowRegisterEventEnum.RelativeTimeEvent) {
            triggerDate = moment(triggerDate).add(eventInfo.args.elapsed as number, eventInfo.args.TIMEUNIT as any).toDate();
        }
        const model = {
            subjectId: contractId, triggerDate, triggerLimit: 1,
            initiatorType: EventRegisterInitiatorTypeEnum.ContractService,
            triggerUnixTimestamp: Math.ceil(triggerDate.getTime() / 1000),
            callbackParams: eventInfo
        };
        return this.dateArrivedEventRegisterProvider.create([model], {session}).then(([eventInfo]) => {
            // 如果当天24点之前,则直接加入时间监控队列
            if (triggerDate < moment({hour: 24}).toDate()) {
                callback(() => this.triggerContractEvent(eventInfo));
            }
        });
    }

    /**
     * 触发合同事件
     * @param model
     */
    async triggerContractEvent(model) {
        return this.timeoutTaskTimer.addTimerTask(model._id.toString(), model.triggerDate, () => {
            this.kafkaClient.send({
                topic: 'contract-fsm-event-trigger-topic', acks: -1, messages: [{
                    key: model.subjectId.toString(), value: JSON.stringify(model.callbackParams)
                }]
            });
        });
    }

    /**
     * 先取消注册之前的事件,再注册新的事件
     * @param session
     * @param contractId
     */
    async cancelRegister(session: ClientSession, contractId: string) {
        return this.dateArrivedEventRegisterProvider.deleteMany({
            subjectId: contractId,
            initiatorType: EventRegisterInitiatorTypeEnum.ContractService
        }, {session});
    }
}
