const Base = require('./base.js');

module.exports = class extends Base {

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
        // shstate: 1 删除，2未验证，3验证中，4 验证通过
        const data = await model.query("select * from culture_student where " +stunocondition+" and "+studentnamecondition+" and "+telcondition+" and "+wxcondition+" and studentID limit "+start+","+pagesize+" ");
        return this.success({pageindex:pageindex,pagesize:pagesize,data})
    }
    
}