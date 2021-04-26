import { KafkaClient } from '../kafka/client';
export declare class FreelogCycleHelper {
    kafkaClient: KafkaClient;
    /**
     * 启动周期事件触发job
     */
    startCycleJob(): void;
    /**
     * 根据指定日期获得对应的周期数
     * @param date
     */
    getCycleNumber(date: Date): number;
    /**
     * 周期配置
     * @constructor
     */
    static get CycleSetting(): {
        startCycleNumber: number;
        beginDate: Date;
        cycleIntervalMillisecond: number;
    };
}
