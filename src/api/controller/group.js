const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const id = this.post('id');
        const groupname = this.post('groupname');

        let param = {
            activityid:id,
            groupName:groupname
        }

        const insertid = await this.model('group').add(param);
        return this.success('添加成功')
    }

    async joinGroupAction() {
        const groupid = this.get('groupid');
        const studentid = this.get('studentid');
        const activityid = this.get('activityid');
        let para = {
            groupid,studentid,activityid
        }

        let insertid = await this.model('student_group').add(para);
        return this.success('加入成功')
    }
}