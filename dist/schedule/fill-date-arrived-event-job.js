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
var FillDateArrivedEventJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillDateArrivedEventJob = void 0;
const midway_1 = require("midway");
const date_arrived_event_reduction_handler_1 = require("../event-handler/event-data-reduction-handler/date-arrived-event-reduction-handler");
let FillDateArrivedEventJob = FillDateArrivedEventJob_1 = class FillDateArrivedEventJob {
    async exec(ctx) {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        await this.dateArrivedEventReductionHandler.handle(expirationDate);
    }
    static get scheduleOptions() {
        return {
            cron: '0 */55 * * * *',
            type: 'worker',
            immediate: true,
            disable: false
        };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", date_arrived_event_reduction_handler_1.DateArrivedEventReductionHandler)
], FillDateArrivedEventJob.prototype, "dateArrivedEventReductionHandler", void 0);
FillDateArrivedEventJob = FillDateArrivedEventJob_1 = __decorate([
    midway_1.provide(),
    midway_1.schedule(FillDateArrivedEventJob_1.scheduleOptions)
], FillDateArrivedEventJob);
exports.FillDateArrivedEventJob = FillDateArrivedEventJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC1kYXRlLWFycml2ZWQtZXZlbnQtam9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjaGVkdWxlL2ZpbGwtZGF0ZS1hcnJpdmVkLWV2ZW50LWpvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlFO0FBRWpFLDZJQUFvSTtBQUlwSSxJQUFhLHVCQUF1QiwrQkFBcEMsTUFBYSx1QkFBdUI7SUFLaEMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFtQjtRQUMxQixNQUFNLGNBQWMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xDLGNBQWMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sSUFBSSxDQUFDLGdDQUFnQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsTUFBTSxLQUFLLGVBQWU7UUFDdEIsT0FBTztZQUNILElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsSUFBSTtZQUNmLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQTtBQWhCRztJQURDLGVBQU0sRUFBRTs4QkFDeUIsdUVBQWdDO2lGQUFDO0FBSDFELHVCQUF1QjtJQUZuQyxnQkFBTyxFQUFFO0lBQ1QsaUJBQVEsQ0FBQyx5QkFBdUIsQ0FBQyxlQUFlLENBQUM7R0FDckMsdUJBQXVCLENBbUJuQztBQW5CWSwwREFBdUIifQ==