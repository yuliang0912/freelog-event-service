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
                partitionsConsumedConcurrently: 3,
                eachMessage: async (...args) => {
                    const { topic } = lodash_1.first(args);
                    const asyncHandleFunc = this.consumerTopicAsyncHandleFunc.get(buildTopicGroupKey(topic, groupId));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2thZmthL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FLaUI7QUFDakIsbUNBQStEO0FBRS9ELG1DQUFxQztBQUNyQyx1REFBa0Q7QUFFbEQ7O0dBRUc7QUFHSCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBQXhCO1FBTUksY0FBUyxHQUFlLEVBQUUsQ0FBQztRQUMzQixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUV4QixpQ0FBNEIsR0FBRyxJQUFJLEdBQUcsRUFBMEQsQ0FBQztJQXlFckcsQ0FBQztJQXRFRyxLQUFLLENBQUMsT0FBTztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFzQztRQUNuRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBYSxFQUFFLE9BQWUsRUFBRSxFQUFFO1lBQzFELE9BQU8sU0FBUyxLQUFLLGNBQWMsT0FBTyxFQUFFLENBQUM7UUFDakQsQ0FBQyxDQUFBO1FBQ0QsTUFBTSxVQUFVLEdBQUcsZ0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVB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