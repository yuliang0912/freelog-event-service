'use strict';

const Controller = require('egg').Controller

module.exports = class GroupController extends Controller {

    async index(ctx) {

        ctx.success('hello')

    }
}
