import {inject, provide, scope, ScopeEnum} from 'midway';
import {IContractRegisterEventMessage} from '../../interface';
import {ClientSession} from 'mongodb';
import CycleEventRegisterProvider from '../../app/data-provider/cycle-event-register-provider';
import * as moment from 'moment';
import {FreelogCycleHelper} from '../../extend/freelog-cycle-helper';
import {EventRegisterInitiatorTypeEnum} from '../../enum';

@provide()
@scope(ScopeEnum.Singleton)
export class CycleRegisterEventHandler {

    @inject()
    freelogCycleHelper: FreelogCycleHelper;
    @inject()
    cycleEventRegisterProvider: CycleEventRegisterProvider;

    /**
     * 周期注册事件处理
     * @param session
     * @param contractId
     * @param eventInfo
     */
    async messageHandle(session: ClientSession, contractId: string, eventInfo: IContractRegisterEventMessage): Promise<void> {
        const {cycleCount, cycleUnit} = eventInfo.args;
        const eventApplyDate = this.getEventApplyDate(eventInfo.eventTime, cycleCount as number, cycleUnit as any);
        const cycleNumber = this.freelogCycleHelper.getCycleNumber(eventApplyDate);
        const model = {
            subjectId: contractId,
            initiatorType: EventRegisterInitiatorTypeEnum.ContractService,
            cycleNumber, triggerLimit: 1,
            callbackParams: eventInfo
        }
        return this.cycleEventRegisterProvider.create([model], {session});
    }

    /**
     * 先取消注册之前的事件,再注册新的事件
     * @param session
     * @param contractId
     */
    async cancelRegister(session: ClientSession, contractId: string) {
        return this.cycleEventRegisterProvider.deleteMany({
            subjectId: contractId,
            initiatorType: EventRegisterInitiatorTypeEnum.ContractService
        }, {session});
    }

    /**
     * 获取事件调用时间
     * @param eventTime
     * @param cycleCount
     * @param cycleUnit
     */
    getEventApplyDate(eventTime: Date, cycleCount: number, cycleUnit: 'weeks' | 'days' | 'cycles' | 'months' | 'years') {
        if (!['cycles', 'cycle'].includes(cycleUnit?.toLocaleLowerCase())) {
            return moment(eventTime).add(cycleCount ?? 1, cycleUnit as any).toDate();
        }
        return moment(eventTime).add((cycleCount ?? 1) * 4, 'hours').toDate();
    }
}
