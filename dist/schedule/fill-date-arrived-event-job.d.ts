import { CommonSchedule } from 'midway';
import { FreelogContext } from 'egg-freelog-base';
import { DateArrivedEventReductionHandler } from '../event-handler/event-data-reduction-handler/date-arrived-event-reduction-handler';
export declare class FillDateArrivedEventJob implements CommonSchedule {
    dateArrivedEventReductionHandler: DateArrivedEventReductionHandler;
    exec(ctx: FreelogContext): Promise<void>;
    static get scheduleOptions(): {
        cron: string;
        type: string;
        immediate: boolean;
        disable: boolean;
    };
}
