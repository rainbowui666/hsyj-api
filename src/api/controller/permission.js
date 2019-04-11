const Base = require('./base.js');

module.exports = class extends Base {
    async saveAction() {
        const userData = {
            permissionName: this.get('permissionname')
        }

        let id = this.get('id');
        let roleid = this.get('roleid');
        if (think.isEmpty(id)) {
            
            let insertid = await this.model('permission').add(userData);
            await this.model('role_permission').add({permissionid: insertid, roleid: roleid});
        } else {
            await this.model('permission').where({permissionID: id}).update(userData);
            await this.model('role_permission').where({permissionid: id}).delete();
            await this.model('role_permission').add({permissionid: id, roleid: roleid});
        }
        
        return this.success(' success');
    }

    async assignSchoolAction() {
        const id = this.get('schoolid');
        const permissionid = this.get('permissionid')
        const data = {
            schoolid: id,permissionid:permissionid
        }
        let insertid = await this.model('permission_school').add(data);
        return this.success('分配成功');
    }

    async deleteAction() {
        const id = this.get('id');
        await this.model('permission').where({permissionID: id}).delete();

        return this.success('删除成功')
    }
}