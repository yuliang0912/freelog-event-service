"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashedWheelSlot = void 0;
class HashedWheelSlot {
    constructor(wheelIndex, slotIndex) {
        this.timeoutTaskArray = new Map();
        this.slotIndex = slotIndex;
        this.wheelIndex = wheelIndex;
    }
    /**
     * 新增定时任务到槽中
     * @param taskInfo
     */
    add(taskInfo) {
        if (!this.timeoutTaskArray.has(taskInfo.taskId)) {
            this.timeoutTaskArray.set(taskInfo.taskId, taskInfo);
        }
    }
    /**
     * 是否是指定index的槽
     * @param slotIndex
     * @returns {boolean}
     */
    equals(slotIndex) {
        return this.slotIndex === slotIndex;
    }
}
exports.HashedWheelSlot = HashedWheelSlot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGVkLXdoZWVsLXNsb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFzaGVkLXdoZWVsLXRpbWVyL2hhc2hlZC13aGVlbC1zbG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsZUFBZTtJQU14QixZQUFZLFVBQWtCLEVBQUUsU0FBaUI7UUFGakQscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQTJCLENBQUM7UUFHbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNILEdBQUcsQ0FBQyxRQUF5QjtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ3ZEO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsU0FBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQTtJQUN2QyxDQUFDO0NBQ0o7QUE3QkQsMENBNkJDIn0=