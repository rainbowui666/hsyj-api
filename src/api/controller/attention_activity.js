const Base = require('./base.js');

module.exports = class extends Base {
    async attentionActivityAction() {
        const studentid = this.get('studentid');
        const sceneryid = this.get('sceneryid');
        const activityid = this.get('activityid');
        const shstate = this.get('shstate') || 1;

        // 活动的起点id
        const startSceneryid = await this.model('activity').field('startSceneryid').where({activityID: activityid}).getField('startSceneryid', true);

        // 是否有数据
        const dataCount = await this.model('attention_activity').where({studentid:studentid,sceneryid:startSceneryid,activityid:activityid}).select();
console.log('startSceneryid', startSceneryid)
        if (sceneryid == startSceneryid || think.isEmpty(startSceneryid)) {
            let data = {
                studentid,sceneryid,shstate,activityid
            }
            console.log('111')
            const insertid = await this.model('attention_activity').add(data);
            return this.success('添加成功');
        } else if (dataCount.length == 0) {
            return this.fail('失败,第一个签到景点必须为起点')
        }

        const para = {
            studentid,
            sceneryid,activityid,shstate
        }
        console.log('222')
        const data = await this.model('attention_activity').add(para);
        return this.success('签到成功');
    }
}