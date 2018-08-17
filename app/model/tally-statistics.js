'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const TallyStatisticsSchema = new mongoose.Schema({
        subjectId: {type: String, required: true}, //主题ID
        subjectType: {type: Number, required: true}, //主题类型
        count: {type: Number, default: 1, required: true},
        status: {type: Number, default: 1, required: true},
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
    })

    TallyStatisticsSchema.index({subjectId: 1, subjectType: 1}, {unique: true})

    return mongoose.model('tally-statistics', TallyStatisticsSchema)
}
