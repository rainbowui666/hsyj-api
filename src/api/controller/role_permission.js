const Base = require('./base.js');

module.exports = class extends Base {
    async saveAction() {
        const userData = {
            permissionid: this.get('permissionid'),
            roleid: this.get('roleid')
        }

        let permissionid = this.get('permissionid');
        let roleid = this.get('roleid');
        if (!think.isEmpty(permissionid) && !think.isEmpty(roleid)) {
            await this.model('role_permission').add(userData);
        }

        return this.success(' success');
    }

    // async deleteAction() {
    //     const id = this.get('id');
    //     await this.model('permission').where({permissionID: id}).delete();

    //     return this.success('删除成功')
    // }
}