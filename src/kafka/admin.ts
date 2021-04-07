import {logLevel} from 'kafkajs';

const {Kafka} = require('kafkajs')

export class KafkaManager {

    TOPIC_CONTRACT_EVENT_TRIGGER_NAME: 'contract_event_trigger'

    async main() {
        const kafka = new Kafka({
            clientId: 'freelog-contract-service',
            logLevel: logLevel.ERROR,
            brokers: ['192.168.164.165:9090']
        });
        const admin = kafka.admin();
        await admin.connect().then(() => {
            admin.createTopics({
                topics: [{topic: this.TOPIC_CONTRACT_EVENT_TRIGGER_NAME, numPartitions: 2}]
            })
        })
    }
}
