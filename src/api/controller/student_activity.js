const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const studentID = this.get('studentid');
        const activityid = this.get('activityid');
        const shstate = this.get('shstate');
        let data = {
            studentID,activityid,shstate
        }
        const insertid = await this.model('student_activity').add(data);
        await this.cache('home_activity_scenery', null, 'redis');
        return this.success('活动签到成功');
    }
}