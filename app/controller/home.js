'use strict';

const Controller = require('egg').Controller

module.exports = class GroupController extends Controller {

    async index(ctx) {
        let datalist = await ctx.dal.contractEventProvider.deleteContractEvent({eventId: 1})
        ctx.success(datalist)
    }
}
