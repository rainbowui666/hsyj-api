function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {

    getStudentListAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const pageindex = _this.post('pageindex') || 1;
            const pagesize = _this.post('pagesize') || 10;

            const stuno = _this.post('stuno');
            const studentName = _this.post('studentname');
            const tel = _this.post('tel');
            const wxchat = _this.post('wxchat');

            let stunocondition = '';
            let studentnamecondition = '';
            let telcondition = '';
            let wxcondition = '';

            if (think.isEmpty(stuno)) {
                stunocondition = '1=1 ';
            } else {
                stunocondition = "stuNo='" + stuno + "'";
            }

            if (think.isEmpty(studentName)) {
                studentnamecondition = '1=1 ';
            } else {
                studentnamecondition = "studentName='" + studentName + "'";
            }

            if (think.isEmpty(tel)) {
                telcondition = '1=1 ';
            } else {
                telcondition = "tel='" + tel + "'";
            }

            if (think.isEmpty(wxchat)) {
                wxcondition = '1=1 ';
            } else {
                wxcondition = "wxchat='" + wxchat + "'";
            }

            const start = (pageindex - 1) * pagesize;
            const model = _this.model('student');
            // shstate: 1 删除，2未验证，3验证中，4 验证通过
            const data = yield model.query("select * from culture_student where " + stunocondition + " and " + studentnamecondition + " and " + telcondition + " and " + wxcondition + " and studentID limit " + start + "," + pagesize + " ");
            return _this.success({ pageindex: pageindex, pagesize: pagesize, data });
        })();
    }

    getStudentDetailAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this2.get('studentid');
            const data = yield _this2.model('student').where({ studentID: studentid }).find();
            if (!think.isEmpty(data)) {
                data.schoolName = yield _this2.model('school').where({ schoolID: data.schoolid }).getField('schoolName', true);
            }

            return _this2.success(data);
        })();
    }

};
//# sourceMappingURL=student.js.map