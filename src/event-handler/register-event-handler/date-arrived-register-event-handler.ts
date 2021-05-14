import {ClientSession} from 'mongodb';
import {ContractAllowRegisterEventEnum, EventRegisterInitiatorTypeEnum} from '../../enum';
import {IContractRegisterEventMessage} from '../../interface';
import {inject, provide, scope, ScopeEnum} from 'midway';
import * as moment from 'moment';
import DateArrivedEventRegisterProvider from '../../app/data-provider/date-arrived-event-register-provider';
import {TimeoutTaskTimer} from '../../hashed-wheel-timer';
import {KafkaClient} from '../../kafka/client';
import {first, isEmpty} from 'lodash';
import {ContractEventTriggerHandler} from '../contract-event-trigger-handler';

@provide()
@scope(ScopeEnum.Singleton)
export class DateArrivedRegisterEventHandler {

    @inject()
    kafkaClient: KafkaClient;
    @inject()
    timeoutTaskTimer: TimeoutTaskTimer;
    @inject()
    contractEventTriggerHandler: ContractEventTriggerHandler;
    @inject()
    dateArrivedEventRegisterProvider: DateArrivedEventRegisterProvider;

    /**
     * 时间相关的事件注册
     * @param session
     * @param contractId
     * @param eventInfo
     */
    async messageHandle(session: ClientSession, contractId: string, eventInfo: IContractRegisterEventMessage): Promise<void> {
        let triggerDate: Date = eventInfo.eventTime;
        if (eventInfo.code === ContractAllowRegisterEventEnum.AbsolutelyTimeEvent) {
            triggerDate = new Date(eventInfo.args.dateTime);
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
        return this.dateArrivedEventRegisterProvider.create([model], {session}).then(events => first(events));
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

    /**
     * 回调事件
     * @param events
     */
    async callbackEventHandle(events: any[]) {

        if (!events || isEmpty(events)) {
            return;
        }
        const currentTime = Date.now();
        const upcomingTime = currentTime + 3600000;
        const outdatedEvents = events.filter(x => x.triggerDate.getTime() <= currentTime);
        const upcomingEvents = events.filter(x => x.triggerDate.getTime() > currentTime && x.triggerDate.getTime() < upcomingTime);
        if (!isEmpty(outdatedEvents)) {
            await this.contractEventTriggerHandler.triggerContractEvent(outdatedEvents).then(() => {
                return this.dateArrivedEventRegisterProvider.updateMany({_id: outdatedEvents.map(x => x._id)}, {
                    $inc: {triggerCount: 1}, status: 2
                })
            }).catch(error => {
                return this.dateArrivedEventRegisterProvider.updateMany({_id: outdatedEvents.map(x => x._id)}, {status: 3})
            });
        }
        if (!isEmpty(upcomingEvents)) {
            for (const eventInfo of upcomingEvents) {
                this.timeoutTaskTimer.addTimerTask(eventInfo._id.toString, eventInfo.triggerDate, (taskId: string) => {
                    this.contractEventTriggerHandler.triggerContractEvent([eventInfo]).then(() => {
                        return this.dateArrivedEventRegisterProvider.updateOne({_id: eventInfo._id}, {
                            $inc: {triggerCount: 1}, status: 2
                        })
                    }).catch(error => {
                        return this.dateArrivedEventRegisterProvider.updateOne({_id: eventInfo._id}, {status: 3})
                    });
                })
            }
        }
    }
}
