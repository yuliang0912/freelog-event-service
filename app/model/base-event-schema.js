'use strict'

const {Schema} = require('mongoose')
const initiatorType = require('../enum/event-initiator-type')

const BaseEventSchema = new Schema({
    subjectId: {type: String, required: true}, //主题ID,目前为contractId 或者 presentableId
    eventRegisterNo: {type: String, required: true}, //事件注册编号,由注册方提供,保证唯一性
    initiatorType: {type: Number, required: true},  //1:事件注册发起者类型
    callbackParams: {}, //事件发生后的回调参数
    triggerLimit: {type: Number, min: 0, default: 1, required: true},
    triggerCount: {type: Number, min: 0, default: 0, required: true},
    status: {type: Number, default: 1, required: true},
}, {
    versionKey: false,
    timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
})

BaseEventSchema.virtual("isChainEvent").get(function () {
    return this.initiatorType > 10
})

BaseEventSchema.virtual("isSubjectEvent").get(function () {
    return this.initiatorType === initiatorType.ContractService
})

BaseEventSchema.virtual("isOverstepTriggerLimit").get(function () {
    return this.triggerLimit > 0 && this.triggerCount >= this.triggerLimit
})

BaseEventSchema.method('eventTriggerSuccess', async function () {
    await this.update({
        $inc: {triggerCount: 1},
        status: this.triggerLimit > 0 && this.triggerCount + 1 >= this.triggerLimit ? 2 : this.status
    })
})

BaseEventSchema.method('eventTriggerFailed', async function () {
    await this.update({status: 3})
})

BaseEventSchema.index({eventRegisterNo: 1, initiatorType: 1}, {unique: true})

module.exports = BaseEventSchema
