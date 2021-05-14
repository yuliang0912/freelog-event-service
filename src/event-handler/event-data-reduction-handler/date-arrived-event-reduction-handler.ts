import {inject, provide, scope, ScopeEnum} from 'midway';
import {ContractEventTriggerHandler} from '../contract-event-trigger-handler';
import {TimeoutTaskTimer} from '../../hashed-wheel-timer';
import DateArrivedEventRegisterProvider from '../../app/data-provider/date-arrived-event-register-provider';

@provide()
@scope(ScopeEnum.Singleton)
export class DateArrivedEventReductionHandler {

    @inject()
    timeoutTaskTimer: TimeoutTaskTimer;
    @inject()
    contractEventTriggerHandler: ContractEventTriggerHandler;
    @inject()
    dateArrivedEventRegisterProvider: DateArrivedEventRegisterProvider;

    /**
     * job定时触发,然后查询最新未触发的数据,加入到列表
     * @param expirationDate
     */
    async handle(expirationDate: Date) {
        return this.dateArrivedEventReductionHandle(expirationDate);
    }

    /**
     * 时间到达事件数据填充
     * @param expirationDate
     * @param skip
     * @param limit
     */
    async dateArrivedEventReductionHandle(expirationDate: Date, skip = 0, limit = 1000) {
        const condition = {
            triggerDate: {$lt: expirationDate}, status: 1,
            $where: 'this.triggerCount < this.triggerLimit'
        };
        const triggerEvents = await this.dateArrivedEventRegisterProvider.find(condition, null, {
            skip, limit, sort: {_id: 1}
        });
        for (const eventInfo of triggerEvents) {
            this.timeoutTaskTimer.addTimerTask(eventInfo._id, eventInfo.triggerDate, () => {
                this.contractEventTriggerHandler.triggerContractEvent([eventInfo]).then(() => {
                    eventInfo.eventTriggerSuccessful();
                }).catch(error => {
                    eventInfo.eventTriggerFailed();
                });
            });
        }
        if (triggerEvents.length === limit) {
            await this.dateArrivedEventReductionHandle(expirationDate, skip + limit, limit);
        }
    }
}
