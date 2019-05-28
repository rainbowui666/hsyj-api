const Base = require('./base.js');

module.exports = class extends Base {
    async deleteAction() {
        const id = this.get('userid');
        await this.model('user').where({sysUserID: id}).update({shstate:1});
        // await this.model('user').where({sysUserID: id}).delete();
        // await this.model('user_role').where({sysuserid: id}).delete();
        return this.success('删除成功')
    }

    async saveAction() {
        const userData = {
            userName: this.post('userName'),
            pwd: this.post('pwd'),
            usertype: this.post('usertype') || 0,
            schoolid: this.post('schoolid') || '',
            shstate: this.post('shstate') || 0
        }

        let id = this.get('userid');
        // let roleid = this.get('roleid');
            
        if (think.isEmpty(id)) {
            // try {
                // await think.startTrans();
                let insertid = await this.model('user').add(userData)
                // await this.model('user_role').add({sysuserid: insertid, roleid: roleid});
            //     await this.commit();
            // } catch (e) {
            //     await think.rollback();
            // }
        } else {
            await this.model('user').where({sysUserID: id}).update(userData);
            // await this.model('user_role').where({sysuserid: id}).delete();
            // await this.model('user_role').add({sysuserid: id, roleid: roleid});

        }
        
        return this.success(' success');
    }
}