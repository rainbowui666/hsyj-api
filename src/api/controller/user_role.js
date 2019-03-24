const Base = require('./base.js');

module.exports = class extends Base {
    async saveAction() {
        const userData = {
            sysuserid: this.get('sysuserid'),
            roleid: this.get('roleid')
        }

        let sysuserid = this.get('sysuserid');
        let roleid = this.get('roleid');
        if (!think.isEmpty(sysuserid) && !think.isEmpty(roleid)) {
            await this.model('user_role').add(userData);
        }
        // if (think.isEmpty(id)) {
        //     await this.model('permission').add(userData);
        // } else {
        //     await this.model('permission').where({permissionID: id}).update(userData);
        // }
        
        return this.success(' success');
    }

    // async deleteAction() {
    //     const id = this.get('id');
    //     await this.model('permission').where({permissionID: id}).delete();

    //     return this.success('删除成功')
    // }
}