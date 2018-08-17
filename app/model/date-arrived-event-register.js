'use strict'

const EventBaseSchema = require('./base-event-schema')

module.exports = app => {

    const mongoose = app.mongoose

    const DateArrivedEventRegisterSchema = EventBaseSchema.clone()

    DateArrivedEventRegisterSchema.add({triggerDate: {type: Date, required: true}})
    DateArrivedEventRegisterSchema.add({triggerUnixTimestamp: {type: Date, required: true}})
    DateArrivedEventRegisterSchema.index({triggerUnixTimestamp: 1})

    return mongoose.model('date-arrived-event-register', DateArrivedEventRegisterSchema)
}
