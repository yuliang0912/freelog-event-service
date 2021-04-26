import { IContractRegisterEventMessage } from '../../interface';
import { ClientSession } from 'mongodb';
import CycleEventRegisterProvider from '../../app/data-provider/cycle-event-register-provider';
import { FreelogCycleHelper } from '../../extend/freelog-cycle-helper';
export declare class CycleRegisterEventHandler {
    freelogCycleHelper: FreelogCycleHelper;
    cycleEventRegisterProvider: CycleEventRegisterProvider;
    /**
     * 周期注册事件处理
     * @param session
     * @param contractId
     * @param eventInfo
     */
    messageHandle(session: ClientSession, contractId: string, eventInfo: IContractRegisterEventMessage): Promise<void>;
    /**
     * 先取消注册之前的事件,再注册新的事件
     * @param session
     * @param contractId
     */
    cancelRegister(session: ClientSession, contractId: string): Promise<{
        n: number;
        nModified: number;
        ok: number;
    }>;
    /**
     * 获取事件调用时间
     * @param eventTime
     * @param cycleCount
     * @param cycleUnit
     */
    getEventApplyDate(eventTime: Date, cycleCount: number, cycleUnit: 'weeks' | 'days' | 'cycles' | 'months' | 'years'): Date;
}
