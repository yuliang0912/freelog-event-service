import { ContractEventTriggerHandler } from '../contract-event-trigger-handler';
import { TimeoutTaskTimer } from '../../hashed-wheel-timer';
import DateArrivedEventRegisterProvider from '../../app/data-provider/date-arrived-event-register-provider';
export declare class DateArrivedEventReductionHandler {
    timeoutTaskTimer: TimeoutTaskTimer;
    contractEventTriggerHandler: ContractEventTriggerHandler;
    dateArrivedEventRegisterProvider: DateArrivedEventRegisterProvider;
    /**
     * job定时触发,然后查询最新未触发的数据,加入到列表
     * @param expirationDate
     */
    handle(expirationDate: Date): Promise<void>;
    /**
     * 时间到达事件数据填充
     * @param expirationDate
     * @param skip
     * @param limit
     */
    dateArrivedEventReductionHandle(expirationDate: Date, skip?: number, limit?: number): Promise<void>;
}
