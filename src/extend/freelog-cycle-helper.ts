import {inject, provide, scope, ScopeEnum} from 'midway';
import {ApplicationError} from 'egg-freelog-base';
import {scheduleJob} from 'node-schedule'
import {KafkaClient} from '../kafka/client';

@provide()
@scope(ScopeEnum.Singleton)
export class FreelogCycleHelper {

    @inject()
    kafkaClient: KafkaClient;

    /**
     * 启动周期事件触发job
     */
    startCycleJob() {
        const hours = Math.ceil(FreelogCycleHelper.CycleSetting.cycleIntervalMillisecond / 3600000);
        const cronScheduling = `0 0 */${hours} * * *`
        console.log('周期定时任务已启动' + cronScheduling);
        scheduleJob(`0 */1 * * * *`, () => {
            const cycleNumber = this.getCycleNumber(new Date());
            this.kafkaClient.send({
                topic: 'freelog-singleton-event-trigger-topic', acks: -1, messages: [{
                    value: JSON.stringify({eventType: 'EndOfCycle', args: {cycleNumber}})
                }]
            }).catch(() => {
                console.log('周期事件触发失败,周期号为:' + cycleNumber);
            })
        });
    }

    /**
     * 根据指定日期获得对应的周期数
     * @param date
     */
    getCycleNumber(date: Date): number {
        const {beginDate, startCycleNumber, cycleIntervalMillisecond} = FreelogCycleHelper.CycleSetting;
        if (date < beginDate) {
            throw new ApplicationError('日期不在周期配置的范围内');
        }
        const cycleCount = Math.ceil((date.getTime() - beginDate.getTime()) / cycleIntervalMillisecond);
        return cycleCount + startCycleNumber;
    }

    /**
     * 周期配置
     * @constructor
     */
    static get CycleSetting() {
        return {
            startCycleNumber: 1,
            beginDate: new Date(2021, 1, 1), // 大于等于此值
            cycleIntervalMillisecond: 14400000  // 4小时
        }
    }
}
