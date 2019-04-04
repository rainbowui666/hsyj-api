const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const id = this.get('id');
        const groupname = this.get('groupname');

        let param = {
            activityid:id,
            groupName:groupname
        }

        const insertid = await model.add(param);
        return this.success('添加成功')
    }
}