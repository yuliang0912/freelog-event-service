'use strict'

module.exports = class OutsideEventHandler {

    constructor(app) {
        this.app = app
    }

    handle() {
        console.log('目前没有连锁事件需求')
    }
}