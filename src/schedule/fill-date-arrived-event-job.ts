import {provide, schedule, CommonSchedule, inject} from 'midway';
import {FreelogContext} from 'egg-freelog-base';
import {DateArrivedEventReductionHandler} from '../event-handler/event-data-reduction-handler/date-arrived-event-reduction-handler';

@provide()
@schedule(FillDateArrivedEventJob.scheduleOptions)
export class FillDateArrivedEventJob implements CommonSchedule {

    @inject()
    dateArrivedEventReductionHandler: DateArrivedEventReductionHandler;

    async exec(ctx: FreelogContext) {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        await this.dateArrivedEventReductionHandler.handle(expirationDate);
    }

    static get scheduleOptions() {
        return {
            cron: '0 */55 * * * *',
            type: 'worker',
            immediate: true, // 启动时是否立即执行一次
            disable: false
        };
    }
}
