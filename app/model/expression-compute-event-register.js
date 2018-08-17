'use strict'

const EventBaseSchema = require('./base-event-schema')

//表达式求值计算事件
module.exports = app => {

    const mongoose = app.mongoose

    const ExpressionComputeEventRegisterSchema = EventBaseSchema.clone()

    ExpressionComputeEventRegisterSchema.add({comparisonValue: {type: Number, required: true}})
    ExpressionComputeEventRegisterSchema.add({comparisonOperator: {type: Number, required: true}})
    ExpressionComputeEventRegisterSchema.add({expressionInfo: {}})
    
    return mongoose.model('expression-compute-event-register', ExpressionComputeEventRegisterSchema)
}
