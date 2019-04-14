const Base = require('./base.js');

module.exports = class extends Base {
    async attentionActivityAction() {
        const studentid = this.get('studentid');
        const sceneryid = this.get('sceneryid');
        const activityid = this.get('activityid');
        const shstate = this.get('shstate') || 1;

        const para = {
            studentid,
            sceneryid,activityid,shstate
        }
        const data = await this.model('attention_activity').add(para);
        return this.success('签到成功');
    }
}