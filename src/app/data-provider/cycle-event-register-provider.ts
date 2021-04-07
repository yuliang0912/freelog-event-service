import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base';

@provide()
@scope('Singleton')
export default class CycleEventRegisterProvider extends MongodbOperation<any> {
    constructor(@inject('model.CycleEventRegister') model) {
        super(model);
    }
}
