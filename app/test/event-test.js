'use strict'

const {OutsideEvent, outsideEvents} = require('../enum/app-event-emitter-enum')

module.exports = class eventEmitTest {

    constructor(app) {
        this.app = app
        setImmediate(() => this.test())
    }

    test() {
        setTimeout(() => {
            //this.app.emit(OutsideEvent, outsideEvents.PresentableConsumptionCountChangedEvent, {presentableId: '5b0f57d1503ced3fbc3dee71'})
        }, 1000)
    }
}