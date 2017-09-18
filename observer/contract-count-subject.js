/**
 * Created by yuliang on 2017/9/18.
 */

const baseSubject = require('./base-subject')

module.exports = class ContractCountSubject extends baseSubject {
    constructor() {
        super()
        this.observers = {}
        this.contractCount = {}
    }

    /**
     * 注册观察者
     * @param observer
     */
    registerObserver(observer) {
        this.observers[observer.id] = observer;
    }

    /**
     * 移除观察者
     * @param observer
     */
    removeObserver(observer) {
        delete this.observers[observer.id];
    }

    /**
     * 通知观察者
     */
    notifyObservers() {
        for (let observerId in this.observers) {
            if (this.observers.hasOwnProperty(observerId)) {
                this.observers[observerId].update(this.contractCount);
            }
        }
    }

    /**
     * 设置合同数量model
     * @param model
     */
    setContractCount(model) {
        this.contractCount = model
        this.notifyObservers()
    }
}