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

    async getStudentListAction() {
        const pageindex = this.post('pageindex') || 1;
        const pagesize = this.post('pagesize') || 10;

        const stuno = this.post('stuno');
        const studentName = this.post('studentname');
        const tel = this.post('tel');
        const wxchat = this.post('wxchat');

        let stunocondition = '';
        let studentnamecondition = '';
        let telcondition = '';
        let wxcondition = '';

        if (think.isEmpty(stuno)) {
            stunocondition = '1=1 ';
        } else {
            stunocondition = "stuNo='"+stuno+"'"
        }

        if (think.isEmpty(studentName)) {
            studentnamecondition = '1=1 ';
        } else {
            studentnamecondition = "studentName='"+studentName+"'"
        }

        if (think.isEmpty(tel)) {
            telcondition = '1=1 ';
        } else {
            telcondition = "tel='"+tel+"'"
        }

        if (think.isEmpty(wxchat)) {
            wxcondition = '1=1 ';
        } else {
            wxcondition = "wxchat='"+wxchat+"'"
        }
        
        const start = (pageindex -1) * pagesize;
        const model = this.model('student');
        const data = await model.query("select * from culture_student where " +stunocondition+" and "+studentnamecondition+" and "+telcondition+" and "+wxcondition+" and studentID limit "+start+","+pagesize+" ");
        return this.success({pageindex:pageindex,pagesize:pagesize,data})
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