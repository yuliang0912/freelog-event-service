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
var DateArrivedEventRegister_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateArrivedEventRegister = void 0;
const midway_1 = require("midway");
const lodash_1 = require("lodash");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let DateArrivedEventRegister = DateArrivedEventRegister_1 = class DateArrivedEventRegister extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        /**
         * 合同服务同时负责保存整个平台的策略信息.对于策略中存在多样性的策略名称,是否启动等信息,则直接由具体的标的物服务自行保存
         * 整个平台相同的策略会根据一定的算法计算.仅保留一份.
         */
        const DateArrivedEventRegisterScheme = new this.mongoose.Schema({
            subjectId: { type: String, required: true },
            initiatorType: { type: Number, required: true },
            triggerDate: { type: Date, required: true },
            triggerUnixTimestamp: { type: Number, required: true },
            callbackParams: {},
            triggerLimit: { type: Number, min: 0, default: 1, required: true },
            triggerCount: { type: Number, min: 0, default: 0, required: true },
            status: { type: Number, default: 1, required: true },
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: DateArrivedEventRegister_1.toObjectOptions,
            toObject: DateArrivedEventRegister_1.toObjectOptions
        });
        DateArrivedEventRegisterScheme.index({ triggerUnixTimestamp: 1 });
        DateArrivedEventRegisterScheme.method('eventTriggerSuccessful', async function () {
            await this.updateOne({
                $inc: { triggerCount: 1 },
                status: this.triggerLimit > 0 && this.triggerCount + 1 >= this.triggerLimit ? 2 : this.status
            });
        });
        DateArrivedEventRegisterScheme.method('eventTriggerFailed', async function () {
            await this.update({ status: 3 });
        });
        return this.mongoose.model('registered-date-arrived-events', DateArrivedEventRegisterScheme);
    }
    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return lodash_1.omit(ret, ['_id', 'id']);
            }
        };
    }
};
DateArrivedEventRegister = DateArrivedEventRegister_1 = __decorate([
    midway_1.scope('Singleton'),
    midway_1.provide('model.DateArrivedEventRegister'),
    __param(0, midway_1.plugin('mongoose')),
    __metadata("design:paramtypes", [Object])
], DateArrivedEventRegister);
exports.DateArrivedEventRegister = DateArrivedEventRegister;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hcnJpdmVkLWV2ZW50LXJlZ2lzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVsL2RhdGUtYXJyaXZlZC1ldmVudC1yZWdpc3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThDO0FBQzlDLG1DQUE0QjtBQUM1Qix1RkFBZ0Y7QUFJaEYsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXlCLFNBQVEsdUNBQWlCO0lBRTNELFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFDZDs7O1dBR0c7UUFDSCxNQUFNLDhCQUE4QixHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDNUQsU0FBUyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3pDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUM3QyxXQUFXLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDekMsb0JBQW9CLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDcEQsY0FBYyxFQUFFLEVBQUU7WUFDbEIsWUFBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNoRSxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ2hFLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1NBQ3JELEVBQUU7WUFDQyxVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUM7WUFDOUQsTUFBTSxFQUFFLDBCQUF3QixDQUFDLGVBQWU7WUFDaEQsUUFBUSxFQUFFLDBCQUF3QixDQUFDLGVBQWU7U0FDckQsQ0FBQyxDQUFDO1FBRUgsOEJBQThCLENBQUMsS0FBSyxDQUFDLEVBQUMsb0JBQW9CLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNoRSw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsS0FBSztZQUNqRSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLEVBQUM7Z0JBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2FBQ2hHLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0gsOEJBQThCLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEtBQUs7WUFDN0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLDhCQUE4QixDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVELE1BQU0sS0FBSyxlQUFlO1FBQ3RCLE9BQU87WUFDSCxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUc7Z0JBQ2QsT0FBTyxhQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQztTQUNKLENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQTtBQWhEWSx3QkFBd0I7SUFGcEMsY0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNsQixnQkFBTyxDQUFDLGdDQUFnQyxDQUFDO0lBR3pCLFdBQUEsZUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztHQUZ0Qix3QkFBd0IsQ0FnRHBDO0FBaERZLDREQUF3QiJ9