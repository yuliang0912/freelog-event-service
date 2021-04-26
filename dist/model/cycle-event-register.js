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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CycleEventRegister_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CycleEventRegister = void 0;
const midway_1 = require("midway");
const lodash_1 = require("lodash");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let CycleEventRegister = CycleEventRegister_1 = class CycleEventRegister extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        /**
         * 合同服务同时负责保存整个平台的策略信息.对于策略中存在多样性的策略名称,是否启动等信息,则直接由具体的标的物服务自行保存
         * 整个平台相同的策略会根据一定的算法计算.仅保留一份.
         */
        const CycleEventRegisterScheme = new this.mongoose.Schema({
            subjectId: { type: String, required: true },
            initiatorType: { type: Number, required: true },
            cycleNumber: { type: Number, required: true },
            callbackParams: {},
            triggerLimit: { type: Number, min: 0, default: 1, required: true },
            triggerCount: { type: Number, min: 0, default: 0, required: true },
            status: { type: Number, default: 1, required: true },
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: CycleEventRegister_1.toObjectOptions,
            toObject: CycleEventRegister_1.toObjectOptions
        });
        CycleEventRegisterScheme.index({ cycleNumber: 1, status: 1 });
        CycleEventRegisterScheme.method('eventTriggerSuccessful', async function () {
            await this.updateOne({
                $inc: { triggerCount: 1 },
                status: this.triggerLimit > 0 && this.triggerCount + 1 >= this.triggerLimit ? 2 : this.status
            });
        });
        CycleEventRegisterScheme.method('eventTriggerFailed', async function () {
            await this.update({ status: 3 });
        });
        return this.mongoose.model('registered-cycle-events', CycleEventRegisterScheme);
    }
    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return lodash_1.omit(ret, ['_id', 'id']);
            }
        };
    }
};
CycleEventRegister = CycleEventRegister_1 = __decorate([
    midway_1.scope('Singleton'),
    midway_1.provide('model.CycleEventRegister'),
    __param(0, midway_1.plugin('mongoose')),
    __metadata("design:paramtypes", [Object])
], CycleEventRegister);
exports.CycleEventRegister = CycleEventRegister;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ljbGUtZXZlbnQtcmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwvY3ljbGUtZXZlbnQtcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5QyxtQ0FBNEI7QUFDNUIsdUZBQWdGO0FBSWhGLElBQWEsa0JBQWtCLDBCQUEvQixNQUFhLGtCQUFtQixTQUFRLHVDQUFpQjtJQUVyRCxZQUFnQyxRQUFRO1FBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2Q7OztXQUdHO1FBQ0gsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3RELFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN6QyxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDN0MsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQzNDLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLFlBQVksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDaEUsWUFBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNoRSxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztTQUNyRCxFQUFFO1lBQ0MsVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFDO1lBQzlELE1BQU0sRUFBRSxvQkFBa0IsQ0FBQyxlQUFlO1lBQzFDLFFBQVEsRUFBRSxvQkFBa0IsQ0FBQyxlQUFlO1NBQy9DLENBQUMsQ0FBQztRQUVILHdCQUF3QixDQUFDLEtBQUssQ0FBQyxFQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDNUQsd0JBQXdCLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLEtBQUs7WUFDM0QsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQixJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDO2dCQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTthQUNoRyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQztRQUNILHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxLQUFLO1lBQ3ZELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCxNQUFNLEtBQUssZUFBZTtRQUN0QixPQUFPO1lBQ0gsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHO2dCQUNkLE9BQU8sYUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUE7QUEvQ1ksa0JBQWtCO0lBRjlCLGNBQUssQ0FBQyxXQUFXLENBQUM7SUFDbEIsZ0JBQU8sQ0FBQywwQkFBMEIsQ0FBQztJQUduQixXQUFBLGVBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7R0FGdEIsa0JBQWtCLENBK0M5QjtBQS9DWSxnREFBa0IifQ==