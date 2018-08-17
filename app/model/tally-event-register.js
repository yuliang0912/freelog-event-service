'use strict'

const EventBaseSchema = require('./base-event-schema')
const {PresentableSignCountTallyEvent} = require('../enum/event-type-enum')
const comparisonOperatorEnum = require('../enum/comparison-operator-enum')

//计数器事件注册
module.exports = app => {

    const mongoose = app.mongoose

    const EventResultComparisonSchema = new mongoose.Schema({
        eventNo: {type: String, required: true},  //事件ID,随机产生
        eventType: {type: Number, required: true}, //计数事件关心的基础枚举事件类型
        comparisonValue: {type: Number, required: true}, //表达式结果对比值
        comparisonOperator: {type: Number, required: true}, //比较运算符(与或运算计算).
    }, {_id: false})

    //获取订阅事件的值与预设值对比结果
    EventResultComparisonSchema.method('contrast', function (result) {

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

    const TallyEventRegisterSchema = EventBaseSchema.clone()
    TallyEventRegisterSchema.add({subscribeEnumEvent: EventResultComparisonSchema})
    TallyEventRegisterSchema.add({eventType: {type: Number, enum: [PresentableSignCountTallyEvent], required: true}})

    return mongoose.model('tally-event-register', TallyEventRegisterSchema)
}
