"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaClient = void 0;
const kafkajs_1 = require("kafkajs");
const midway_1 = require("midway");
const lodash_1 = require("lodash");
const egg_freelog_base_1 = require("egg-freelog-base");
/**
 * WIKI:https://kafka.js.org/docs/getting-started
 */
let KafkaClient = class KafkaClient {
    constructor() {
        this.consumers = [];
        this.producerIsReady = false;
        this.consumerTopicAsyncHandleFunc = new Map();
    }
    async initial() {
        this.kafka = new kafkajs_1.Kafka(this.kafkaConfig);
        this.producer = this.kafka.producer();
        this._instrumentationEvents();
    }
    /**
     * 订阅主题消息
     * @param topics
     */
    async subscribes(topics) {
        const buildTopicGroupKey = (topic, groupId) => {
            return `topic_${topic}##group_id_${groupId}`;
        };
        const topicGroup = lodash_1.groupBy(topics, x => x.consumerGroupId);
        for (const [groupId, topicGroups] of Object.entries(topicGroup)) {
            const consumer = this.kafka.consumer({ groupId });
            await consumer.connect().catch(() => {
                throw new egg_freelog_base_1.ApplicationError('kafka消费者连接失败');
            });
            for (const topicInfo of topicGroups) {
                await consumer.subscribe({ topic: topicInfo.subscribeTopicName });
                this.consumerTopicAsyncHandleFunc.set(buildTopicGroupKey(topicInfo.subscribeTopicName, topicInfo.consumerGroupId), topicInfo.messageHandle);
            }
            await consumer.run({
                partitionsConsumedConcurrently: 2,
                eachBatch: async (...args) => {
                    const { batch } = lodash_1.first(args);
                    const asyncHandleFunc = this.consumerTopicAsyncHandleFunc.get(buildTopicGroupKey(batch.topic, groupId));
                    await Reflect.apply(asyncHandleFunc, null, args);
                }
            });
            this.consumers.push(consumer);
        }
    }
    /**
     * 发送消息
     * @param record
     */
    async send(record) {
        return this.producer.send(record);
    }
    /**
     * 批量发送消息
     * @param batch
     */
    async sendBatch(batch) {
        return this.producer.sendBatch(batch);
    }
    /**
     * 释放连接
     */
    async disconnect() {
        this.producer.disconnect().then();
        this.consumers.forEach(consumer => consumer.disconnect());
    }
    _instrumentationEvents() {
        this.producer.on(this.producer.events.CONNECT, () => {
            this.producerIsReady = true;
            console.log('kafka producer connected');
        });
        this.producer.on(this.producer.events.DISCONNECT, () => {
            this.producerIsReady = false;
            console.log('kafka producer disconnect');
        });
    }
};
__decorate([
    midway_1.config('kafka'),
    __metadata("design:type", Object)
], KafkaClient.prototype, "kafkaConfig", void 0);
__decorate([
    midway_1.init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KafkaClient.prototype, "initial", null);
KafkaClient = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], KafkaClient);
exports.KafkaClient = KafkaClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2thZmthL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FLaUI7QUFDakIsbUNBQStEO0FBRS9ELG1DQUFxQztBQUNyQyx1REFBa0Q7QUFFbEQ7O0dBRUc7QUFHSCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBQXhCO1FBTUksY0FBUyxHQUFlLEVBQUUsQ0FBQztRQUMzQixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUV4QixpQ0FBNEIsR0FBRyxJQUFJLEdBQUcsRUFBd0QsQ0FBQztJQXlFbkcsQ0FBQztJQXRFRyxLQUFLLENBQUMsT0FBTztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFzQztRQUNuRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBYSxFQUFFLE9BQWUsRUFBRSxFQUFFO1lBQzFELE9BQU8sU0FBUyxLQUFLLGNBQWMsT0FBTyxFQUFFLENBQUM7UUFDakQsQ0FBQyxDQUFBO1FBQ0QsTUFBTSxVQUFVLEdBQUcsZ0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVB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