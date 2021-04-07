// import {KafkaStartup} from "./kafka/startup";

import {IBoot} from 'midway';
import {KafkaClient} from './kafka/client';
import {FreelogApplication} from 'egg-freelog-base';
import mongoose from 'egg-freelog-base/database/mongoose';

/**
 * https://eggjs.org/zh-cn/basics/app-start.html
 */
export default class AppBootHook implements IBoot {

    app;

    constructor(app: FreelogApplication) {
        this.app = app;
    }

    async willReady() {
        await mongoose(this.app).then(() => {
            return this.app.applicationContext.getAsync('eventServiceStartup');
        })
    }

    async beforeClose() {
        const kafkaClient: KafkaClient = await this.app.applicationContext.getAsync('kafkaClient');
        await kafkaClient.disconnect();
    }
}
