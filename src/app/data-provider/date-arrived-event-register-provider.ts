import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base';

@provide()
@scope('Singleton')
export default class DateArrivedEventRegisterProvider extends MongodbOperation<any> {
    constructor(@inject('model.DateArrivedEventRegister') model) {
        super(model);
    }
}
