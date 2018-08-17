'use strict'

const EventBaseSchema = require('./base-event-schema')
const {PresentableSignEvent} = require('../enum/event-type-enum')

//枚举类型的事件注册
module.exports = app => {

    const mongoose = app.mongoose

    const EnumerateEventRegisterSchema = EventBaseSchema.clone()

    EnumerateEventRegisterSchema.add({eventType: {type: Number, required: true, enum: [PresentableSignEvent]}})

    return mongoose.model('enumerate-event-register', EnumerateEventRegisterSchema)
}
