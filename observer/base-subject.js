/**
 * Created by yuliang on 2017/9/18.
 */

'use strict'

module.exports = class Subject {

    /**
     * 注册观察者
     */
    registerObserver() {
        throw new Error("This method must be overwritten!");
    }

    /**
     * 移除观察者
     */
    removeObserver() {
        throw new Error("This method must be overwritten!");
    }

    /**
     * 通知观察者
     */
    notifyObservers() {
        throw new Error("This method must be overwritten!");
    }
}