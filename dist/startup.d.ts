import { KafkaClient } from './kafka/client';
import { TimeoutTaskTimer } from './hashed-wheel-timer';
import { RegisterEventHandler } from './event-handler/register-event-handler';
import { FreelogCycleHelper } from './extend/freelog-cycle-helper';
import { SingletonEventTriggerHandler } from './event-handler/singleton-event-trigger-handler';
/**
 * 事件服务启动项
 */
export declare class EventServiceStartup {
    kafkaClient: KafkaClient;
    timeoutTaskTimer: TimeoutTaskTimer;
    freelogCycleHelper: FreelogCycleHelper;
    registerEventHandler: RegisterEventHandler;
    singletonEventTriggerHandler: SingletonEventTriggerHandler;
    main(): Promise<void>;
    /**
     * 连接kafka生产者
     */
    connectKafkaProducer(): Promise<void>;
    /**
     * 订阅kafka主题
     */
    subscribeKafkaTopics(): Promise<void>;
}
