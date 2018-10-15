'use strict'

const EventBaseSchema = require('./base-event-schema')
const comparisonOperatorEnum = require('../enum/comparison-operator-enum')
const {PresentableConsumptionCountTallyEvent} = require('../enum/event-type-enum')

//计数器事件注册
module.exports = app => {

    const mongoose = app.mongoose
    const TallyEventRegisterSchema = EventBaseSchema.clone()

    TallyEventRegisterSchema.add({comparisonValue: {type: Number, required: true}}) //比较值
    TallyEventRegisterSchema.add({comparisonOperator: {type: Number, required: true}}) //比较运算符(与或运算计算).
    TallyEventRegisterSchema.add({
        eventType: {
            type: Number,
            enum: [PresentableConsumptionCountTallyEvent],
            required: true
        }
    })

    //是否匹配对比值结果
    TallyEventRegisterSchema.method('isMatch', function (result) {
        const {comparisonValue, comparisonOperator} = this
        switch (comparisonOperator) {
            case comparisonOperatorEnum.Equal:
                return result === comparisonValue
            case comparisonOperatorEnum.GreaterThan:
                return result > comparisonValue
            case comparisonOperatorEnum.LessThan:
                return result < comparisonValue
            case comparisonOperatorEnum.GreaterThanEqual:
                return result >= comparisonValue
            case comparisonOperatorEnum.LessThanEqual:
                return result <= comparisonValue
            case comparisonOperatorEnum.ToBeDivisibleBy:
                return result % comparisonValue === 0
            default:
                return false
        }
    })

    return mongoose.model('tally-event-register', TallyEventRegisterSchema)
}
