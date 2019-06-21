const Base = require('./base.js');
var CryptoJS = require('crypto-js');

module.exports = class extends Base {
    async deleteAction() {
        const id = this.get('userid');
        await this.model('user').where({sysUserID: id}).delete();
        // await this.model('user').where({sysUserID: id}).delete();
        // await this.model('user_role').where({sysuserid: id}).delete();
        return this.success('删除成功')
    }

    async getUserListBySchoolidAction() {
        const schoolid = this.get('schoolid');
        const data = await this.model('user').where({schoolid:schoolid, shstate: 0}).select();
        // const data = await this.model('user').field(['schoolid','shstate','sysUserID','userName','usertype']).where({schoolid:schoolid, shstate: 0}).select();
        return this.success(data)
    }

    async saveAction() {
        let username = this.post('username');
        let pwd = this.post('pwd');
        let key = CryptoJS.enc.Utf8.parse(this.ctx.state.crpkey);
        var encrypted = CryptoJS.AES.encrypt(pwd, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        const userData = {
            userName: username,
            pwd: encrypted.toString(),
            usertype: this.post('usertype') || 0,
            schoolid: this.post('schoolid') || '',
            shstate: this.post('shstate') || 0
        }

        let id = this.get('userid');
        // let roleid = this.get('roleid');
            
        if (think.isEmpty(id)) {
            // try {
                // await think.startTrans();
            const userDataCount = await this.model('user').where({userName: username}).count('sysUserID');
            if (userDataCount == 0) {
                let insertid = await this.model('user').add(userData)
            } else {
                return this.fail('用户名不能重复,添加失败')
            }
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