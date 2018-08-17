'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class TallyEventRegisterProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.TallyEventRegister)
    }

}