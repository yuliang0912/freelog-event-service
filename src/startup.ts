import {init, inject, provide} from 'midway';
import {KafkaClient} from './kafka/client';
import {TimeoutTaskTimer} from './hashed-wheel-timer';
import {RegisterEventHandler} from './event-handler/register-event-handler';
import {FreelogCycleHelper} from './extend/freelog-cycle-helper';
import {SingletonEventTriggerHandler} from './event-handler/singleton-event-trigger-handler';

/**
 * 事件服务启动项
 */
@provide()
export class EventServiceStartup {

    @inject()
    kafkaClient: KafkaClient;
    @inject()
    timeoutTaskTimer: TimeoutTaskTimer;
    @inject()
    freelogCycleHelper: FreelogCycleHelper;
    @inject()
    registerEventHandler: RegisterEventHandler;
    @inject()
    singletonEventTriggerHandler: SingletonEventTriggerHandler;

    @init()
    async main() {
        this.timeoutTaskTimer.startUp();
        const task1 = this.connectKafkaProducer();
        const task2 = this.subscribeKafkaTopics();
        await Promise.all([task1, task2]);
        this.freelogCycleHelper.startCycleJob();
    }

    /**
     * 连接kafka生产者
     */
    async connectKafkaProducer() {
        return this.kafkaClient.producer.connect().catch(error => {
            console.log('kafka producer connect failed,', error);
        });
    }

    /**
     * 订阅kafka主题
     */
    async subscribeKafkaTopics() {
        const topics = [this.registerEventHandler, this.singletonEventTriggerHandler];
        return this.kafkaClient.subscribes(topics).then(() => {
            console.log('kafka topic 订阅成功!');
        }).catch(error => {
            console.log('kafka topic 订阅失败!', error.toString());
        });
    }
}
