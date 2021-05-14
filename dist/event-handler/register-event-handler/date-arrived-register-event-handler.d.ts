import { ClientSession } from 'mongodb';
import { IContractRegisterEventMessage } from '../../interface';
import DateArrivedEventRegisterProvider from '../../app/data-provider/date-arrived-event-register-provider';
import { TimeoutTaskTimer } from '../../hashed-wheel-timer';
import { KafkaClient } from '../../kafka/client';
import { ContractEventTriggerHandler } from '../contract-event-trigger-handler';
export declare class DateArrivedRegisterEventHandler {
    kafkaClient: KafkaClient;
    timeoutTaskTimer: TimeoutTaskTimer;
    contractEventTriggerHandler: ContractEventTriggerHandler;
    dateArrivedEventRegisterProvider: DateArrivedEventRegisterProvider;
    /**
     * 时间相关的事件注册
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
     * 回调事件
     * @param events
     */
    callbackEventHandle(events: any[]): Promise<void>;
}
