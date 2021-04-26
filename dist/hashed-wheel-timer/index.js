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
exports.TimeoutTaskTimer = void 0;
const midway_1 = require("midway");
const hashed_wheel_timer_1 = require("./hashed-wheel-timer");
let TimeoutTaskTimer = class TimeoutTaskTimer {
    constructor() {
        this.hashedWheelTimer = new hashed_wheel_timer_1.HashedWheelTimer(20, 3);
    }
    startUp() {
        this.hashedWheelTimer.startup();
    }
    /**
     * 新增定时任务
     * @param taskId
     * @param triggerDate
     * @param callback
     */
    addTimerTask(taskId, triggerDate, callback) {
        return this.hashedWheelTimer.addTimedTask(taskId, triggerDate, callback);
    }
    _test() {
        const triggerDate = new Date();
        triggerDate.setSeconds(triggerDate.getSeconds() + 10);
        this.addTimerTask(triggerDate.toISOString(), triggerDate, function (taskId) {
            console.log(`定时任务已触发，预计触发时间：${triggerDate.toISOString()}，实际触发时间：${new Date().toISOString()}。`, taskId);
        });
    }
};
TimeoutTaskTimer = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton'),
    __metadata("design:paramtypes", [])
], TimeoutTaskTimer);
exports.TimeoutTaskTimer = TimeoutTaskTimer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFzaGVkLXdoZWVsLXRpbWVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFzQztBQUN0Qyw2REFBc0Q7QUFJdEQsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7SUFJekI7UUFDSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxxQ0FBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELE9BQU87UUFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsWUFBWSxDQUFDLE1BQWMsRUFBRSxXQUFpQixFQUFFLFFBQTJCO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxLQUFLO1FBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUMvQixXQUFXLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUV0RCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxXQUFXLEVBQUUsVUFBVSxNQUFjO1lBQzlFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLFdBQVcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0csQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQTtBQTlCWSxnQkFBZ0I7SUFGNUIsZ0JBQU8sRUFBRTtJQUNULGNBQUssQ0FBQyxXQUFXLENBQUM7O0dBQ04sZ0JBQWdCLENBOEI1QjtBQTlCWSw0Q0FBZ0IifQ==