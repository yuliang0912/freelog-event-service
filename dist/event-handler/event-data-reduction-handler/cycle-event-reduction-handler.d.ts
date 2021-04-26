import CycleEventRegisterProvider from '../../app/data-provider/cycle-event-register-provider';
import { ContractEventTriggerHandler } from '../contract-event-trigger-handler';
export declare class CycleEventReductionHandler {
    cycleEventRegisterProvider: CycleEventRegisterProvider;
    contractEventTriggerHandler: ContractEventTriggerHandler;
    /**
     * 周期结束时,查询所有当前周期需要触发的事件,然后回调触发
     * @param cycleNumber
     */
    handle(cycleNumber: number): Promise<void>;
    /**
     * cycle周期结束,获取所有本次cycle需要触发的事件集,然后触发事件
     * @param cycleNumber
     * @param skip
     * @param limit
     */
    cycleEventReductionHandle(cycleNumber: number, skip?: number, limit?: number): Promise<void>;
}
