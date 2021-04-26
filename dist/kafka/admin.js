"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaManager = void 0;
const kafkajs_1 = require("kafkajs");
const { Kafka } = require('kafkajs');
class KafkaManager {
    async main() {
        const kafka = new Kafka({
            clientId: 'freelog-contract-service',
            logLevel: kafkajs_1.logLevel.ERROR,
            brokers: ['192.168.164.165:9090']
        });
        const admin = kafka.admin();
        await admin.connect().then(() => {
            admin.createTopics({
                topics: [{ topic: this.TOPIC_CONTRACT_EVENT_TRIGGER_NAME, numPartitions: 2 }]
            });
        });
    }
}
exports.KafkaManager = KafkaManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMva2Fma2EvYWRtaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQWlDO0FBRWpDLE1BQU0sRUFBQyxLQUFLLEVBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFbEMsTUFBYSxZQUFZO0lBSXJCLEtBQUssQ0FBQyxJQUFJO1FBQ04sTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUM7WUFDcEIsUUFBUSxFQUFFLDBCQUEwQjtZQUNwQyxRQUFRLEVBQUUsa0JBQVEsQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO1NBQ3BDLENBQUMsQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1QixNQUFNLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzVCLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0JBQ2YsTUFBTSxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUMsQ0FBQzthQUM5RSxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSjtBQWpCRCxvQ0FpQkMifQ==