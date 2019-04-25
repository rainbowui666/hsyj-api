const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const studentname = this.post('studentname');
        const wxchat = this.post('wxchat');
        const tel = this.post('tel') || '';
        const stuNo = this.post('stuno') || '';
        const idcard = this.post('idcard') || '';
        const birthday= this.post('birthday');
        const schoolid = this.post('schoolid');
        const photo = this.post('photo');
        const shstate = this.post('shstate');
        const pwd = this.post('pwd');
        const wxopenid = this.post('wxopenid');
        const nickname = this.post('nickname');
        const sex = this.post('sex');
        const id = this.get('id');

        let param = {
            studentName:studentname,
            wxchat: wxchat,
            tel,
            stuNo,
            IDCard:idcard,
            birthday,
            schoolid,
            photo,
            shstate,
            pwd,
            wxopenid,
            nickname,
            sex
        }; 

        if (think.isEmpty(id)) {
            let model = this.model('student');
            const insertid = await model.add(param);
            return this.success('添加成功')
        } else {
            await this.model('student').where({studentID:id}).update(param);
            return this.success('修改成功');
        }
    }

    async deleteAction() {
        const id = this.get('id');
        const shstate = this.get('shstate');
        const data = {
            shstate: shstate
        }
        await this.model('student').where({studentID:id}).update(data);
        return this.success('成功')
    }
}