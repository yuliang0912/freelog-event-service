'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class TallyStatisticsProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.TallyStatistics)
    }

}