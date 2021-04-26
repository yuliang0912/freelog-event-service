import {inject, provide, scope, ScopeEnum} from 'midway';
import CycleEventRegisterProvider from '../../app/data-provider/cycle-event-register-provider';
import {ContractEventTriggerHandler} from '../contract-event-trigger-handler';

@provide()
@scope(ScopeEnum.Singleton)
export class CycleEventReductionHandler {

    @inject()
    cycleEventRegisterProvider: CycleEventRegisterProvider;
    @inject()
    contractEventTriggerHandler: ContractEventTriggerHandler;

    /**
     * 周期结束时,查询所有当前周期需要触发的事件,然后回调触发
     * @param cycleNumber
     */
    async handle(cycleNumber: number) {
        return this.cycleEventReductionHandle(cycleNumber)
    }

    /**
     * cycle周期结束,获取所有本次cycle需要触发的事件集,然后触发事件
     * @param cycleNumber
     * @param skip
     * @param limit
     */
    async cycleEventReductionHandle(cycleNumber: number, skip = 0, limit = 1000) {

        const condition = {cycleNumber: {$lte: cycleNumber}, status: 1};
        const triggerEvents = await this.cycleEventRegisterProvider.find(condition, null, {skip, limit});

        for (const eventInfo of triggerEvents) {
            await this.contractEventTriggerHandler.triggerContractEvent(eventInfo).then();
        }
        if (triggerEvents.length === limit) {
            await this.cycleEventReductionHandle(cycleNumber, skip + limit, limit);
        }
    }
}
