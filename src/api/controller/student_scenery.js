const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const studentid = this.get('studentid');
        const sceneryid = this.get('sceneryid');
        const shstate = this.get('shstate');
        let data = {
            studentid,sceneryid,shstate
        }
        const insertid = await this.model('student_scenery').add(data);

        return this.success('添加成功');
    }
}