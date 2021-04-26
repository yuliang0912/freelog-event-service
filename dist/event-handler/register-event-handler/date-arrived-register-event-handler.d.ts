import { ClientSession } from 'mongodb';
import { IContractRegisterEventMessage } from '../../interface';
import DateArrivedEventRegisterProvider from '../../app/data-provider/date-arrived-event-register-provider';
import { TimeoutTaskTimer } from '../../hashed-wheel-timer';
import { KafkaClient } from '../../kafka/client';
export declare class DateArrivedRegisterEventHandler {
    kafkaClient: KafkaClient;
    timeoutTaskTimer: TimeoutTaskTimer;
    dateArrivedEventRegisterProvider: DateArrivedEventRegisterProvider;
    /**
     * 时间相关的事件注册
     * @param session
     * @param contractId
     * @param eventInfo
     * @param callback
     */
    messageHandle(session: ClientSession, contractId: string, eventInfo: IContractRegisterEventMessage, callback: (...args: any[]) => void): Promise<void>;
    /**
     * 触发合同事件
     * @param model
     */
    triggerContractEvent(model: any): Promise<import("../../hashed-wheel-timer/hashed-wheel-task").HashedWheelTask>;
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
}
