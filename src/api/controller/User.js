const Base = require('./base.js');

module.exports = class extends Base {
    async saveAction() {
        const userData = {
            userName: this.get('userName'),
            pwd: this.get('pwd')
        }

        let id = this.get('id');
        let roleid = this.get('roleid');
            
        if (think.isEmpty(id)) {
            // try {
                // await think.startTrans();
                let insertid = await this.model('User').add(userData)
                await this.model('user_role').add({sysuserid: insertid, roleid: roleid});
            //     await this.commit();
            // } catch (e) {
            //     await think.rollback();
            // }
        } else {
            await this.model('User').where({sysUserID: id}).update(userData);
            await this.model('user_role').where({sysuserid: id}).delete();
            await this.model('user_role').add({sysuserid: id, roleid: roleid});

        }
        
        return this.success(' success');
    }

    async deleteAction() {
        const id = this.get('id');
        await this.model('User').where({sysUserID: id}).delete();
        await this.model('user_role').where({sysuserid: id}).delete();
        return this.success('删除成功')
    }
}