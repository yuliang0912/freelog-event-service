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
var FreelogCycleHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelogCycleHelper = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const node_schedule_1 = require("node-schedule");
const client_1 = require("../kafka/client");
let FreelogCycleHelper = FreelogCycleHelper_1 = class FreelogCycleHelper {
    /**
     * 启动周期事件触发job
     */
    startCycleJob() {
        const hours = Math.ceil(FreelogCycleHelper_1.CycleSetting.cycleIntervalMillisecond / 3600000);
        const cronScheduling = `0 0 */${hours} * * *`;
        console.log('周期定时任务已启动' + cronScheduling);
        node_schedule_1.scheduleJob(cronScheduling, () => {
            const cycleNumber = this.getCycleNumber(new Date());
            this.kafkaClient.send({
                topic: 'freelog-singleton-event-trigger-topic', acks: -1, messages: [{
                        value: JSON.stringify({ eventType: 'EndOfCycle', args: { cycleNumber } })
                    }]
            }).catch(() => {
                console.log('周期事件触发失败,周期号为:' + cycleNumber);
            });
        });
    }
    /**
     * 根据指定日期获得对应的周期数
     * @param date
     */
    getCycleNumber(date) {
        const { beginDate, startCycleNumber, cycleIntervalMillisecond } = FreelogCycleHelper_1.CycleSetting;
        if (date < beginDate) {
            throw new egg_freelog_base_1.ApplicationError('日期不在周期配置的范围内');
        }
        const cycleCount = Math.ceil((date.getTime() - beginDate.getTime()) / cycleIntervalMillisecond);
        return cycleCount + startCycleNumber;
    }
    /**
     * 周期配置
     * @constructor
     */
    static get CycleSetting() {
        return {
            startCycleNumber: 1,
            beginDate: new Date(2021, 1, 1),
            cycleIntervalMillisecond: 14400000 // 4小时
        };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", client_1.KafkaClient)
], FreelogCycleHelper.prototype, "kafkaClient", void 0);
FreelogCycleHelper = FreelogCycleHelper_1 = __decorate([
    midway_1.provide(),
    midway_1.scope(midway_1.ScopeEnum.Singleton)
], FreelogCycleHelper);
exports.FreelogCycleHelper = FreelogCycleHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJlZWxvZy1jeWNsZS1oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXh0ZW5kL2ZyZWVsb2ctY3ljbGUtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBeUQ7QUFDekQsdURBQWtEO0FBQ2xELGlEQUF5QztBQUN6Qyw0Q0FBNEM7QUFJNUMsSUFBYSxrQkFBa0IsMEJBQS9CLE1BQWEsa0JBQWtCO0lBSzNCOztPQUVHO0lBQ0gsYUFBYTtRQUNULE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQWtCLENBQUMsWUFBWSxDQUFDLHdCQUF3QixHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzVGLE1BQU0sY0FBYyxHQUFHLFNBQVMsS0FBSyxRQUFRLENBQUE7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFDMUMsMkJBQVcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1lBQzdCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNsQixLQUFLLEVBQUUsdUNBQXVDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDO3dCQUNqRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUMsQ0FBQztxQkFDeEUsQ0FBQzthQUNMLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjLENBQUMsSUFBVTtRQUNyQixNQUFNLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFDLEdBQUcsb0JBQWtCLENBQUMsWUFBWSxDQUFDO1FBQ2hHLElBQUksSUFBSSxHQUFHLFNBQVMsRUFBRTtZQUNsQixNQUFNLElBQUksbUNBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLHdCQUF3QixDQUFDLENBQUM7UUFDaEcsT0FBTyxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sS0FBSyxZQUFZO1FBQ25CLE9BQU87WUFDSCxnQkFBZ0IsRUFBRSxDQUFDO1lBQ25CLFNBQVMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQix3QkFBd0IsRUFBRSxRQUFRLENBQUUsTUFBTTtTQUM3QyxDQUFBO0lBQ0wsQ0FBQztDQUNKLENBQUE7QUE3Q0c7SUFEQyxlQUFNLEVBQUU7OEJBQ0ksb0JBQVc7dURBQUM7QUFIaEIsa0JBQWtCO0lBRjlCLGdCQUFPLEVBQUU7SUFDVCxjQUFLLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCxrQkFBa0IsQ0FnRDlCO0FBaERZLGdEQUFrQiJ9