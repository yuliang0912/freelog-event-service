import { IBoot } from 'midway';
import { FreelogApplication } from 'egg-freelog-base';
/**
 * https://eggjs.org/zh-cn/basics/app-start.html
 */
export default class AppBootHook implements IBoot {
    app: any;
    constructor(app: FreelogApplication);
    willReady(): Promise<void>;
    beforeClose(): Promise<void>;
}
