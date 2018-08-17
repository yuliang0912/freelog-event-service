'use strict'

const EventBaseSchema = require('./base-event-schema')

module.exports = app => {

    const mongoose = app.mongoose

    const CycleEventRegisterSchema = EventBaseSchema.clone()

    //周期号,由周期服务根据时间提供得出 如果为0,则代表每个周期都触发
    CycleEventRegisterSchema.add({cycleNumber: {type: Number, required: true}})
    CycleEventRegisterSchema.index({cycleNumber: 1})

    return mongoose.model('cycle-event-register', CycleEventRegisterSchema)
}
