const Base = require('./base.js');

module.exports = class extends Base {
    async saveAction() {
        const roleData = {
            roleName: this.get('rolename')
        }

        let id = this.get('id');
        if (think.isEmpty(id)) {
            await this.model('role').add(roleData);
        } else {
            await this.model('role').where({roleID: id}).update(roleData);
        }

        return this.success('角色添加成功');
    }

    async deleteAction() {
        const id = this.get('id');
        await this.model('role').where({roleID: id}).delete();

        return this.success('删除成功')
    }
}