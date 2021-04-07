import {scope, provide, plugin} from 'midway';
import {omit} from 'lodash';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.DateArrivedEventRegister')
export class DateArrivedEventRegister extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {
        /**
         * 合同服务同时负责保存整个平台的策略信息.对于策略中存在多样性的策略名称,是否启动等信息,则直接由具体的标的物服务自行保存
         * 整个平台相同的策略会根据一定的算法计算.仅保留一份.
         */
        const DateArrivedEventRegisterScheme = new this.mongoose.Schema({
            subjectId: {type: String, required: true},
            initiatorType: {type: Number, required: true},  // 事件注册发起者类型 1:合约服务
            triggerDate: {type: Date, required: true},
            triggerUnixTimestamp: {type: Number, required: true},
            callbackParams: {}, // 事件发生后的回调参数
            triggerLimit: {type: Number, min: 0, default: 1, required: true},
            triggerCount: {type: Number, min: 0, default: 0, required: true},
            status: {type: Number, default: 1, required: true},
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
            toJSON: DateArrivedEventRegister.toObjectOptions,
            toObject: DateArrivedEventRegister.toObjectOptions
        });

        DateArrivedEventRegisterScheme.index({triggerUnixTimestamp: 1});
        DateArrivedEventRegisterScheme.method('eventTriggerSuccessful', async function (this: any) {
            await this.updateOne({
                $inc: {triggerCount: 1},
                status: this.triggerLimit > 0 && this.triggerCount + 1 >= this.triggerLimit ? 2 : this.status
            })
        });
        DateArrivedEventRegisterScheme.method('eventTriggerFailed', async function (this: any) {
            await this.update({status: 3});
        });

        return this.mongoose.model('registered-date-arrived-events', DateArrivedEventRegisterScheme);
    }

    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return omit(ret, ['_id', 'id']);
            }
        };
    }
}
