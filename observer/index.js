/**
 * Created by yuliang on 2017/9/18.
 */

'use strict'

const contractCountSubject = require('./contract-count-subject')
const presentableEffectiveAuthObserver = require('./presentable-effective-auth-observer')

module.exports = {

    /**
     * 合同数量相关的主题
     * @returns {*}
     */
    contractCountSubject(){
        let subject = new contractCountSubject()

        /**
         * presentable+1 首次激活presentable-contract的观察者
         */
        new presentableEffectiveAuthObserver(subject)

        return subject
    }
}