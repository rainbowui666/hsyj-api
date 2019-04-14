function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const studentname = _this.post('studentname');
            const wxchat = _this.post('wxchat');
            const tel = _this.post('tel') || '';
            const stuNo = _this.post('stuno') || '';
            const idcard = _this.post('idcard') || '';
            const birthday = _this.post('birthday');
            const schoolid = _this.post('schoolid');
            const photo = _this.post('photo');
            const shstate = _this.post('shstate');
            const pwd = _this.post('pwd');
            const wxopenid = _this.post('wxopenid');
            const nickname = _this.post('nickname');
            const sex = _this.post('sex');
            const id = _this.get('id');

            let param = {
                studentName: studentname,
                wxchat: wxchat,
                tel,
                stuNo,
                IDCard: idcard,
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
                let model = _this.model('student');
                const insertid = yield model.add(param);
                return _this.success('添加成功');
            } else {
                yield _this.model('student').where({ studentID: id }).update(param);
                return _this.success('修改成功');
            }
        })();
    }

    getStudentListAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const pageindex = _this2.post('pageindex') || 1;
            const pagesize = _this2.post('pagesize') || 10;

            const stuno = _this2.post('stuno');
            const studentName = _this2.post('studentname');
            const tel = _this2.post('tel');
            const wxchat = _this2.post('wxchat');

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
            const model = _this2.model('student');
            const data = yield model.query("select * from culture_student where " + stunocondition + " and " + studentnamecondition + " and " + telcondition + " and " + wxcondition + " and studentID limit " + start + "," + pagesize + " ");
            return _this2.success({ pageindex: pageindex, pagesize: pagesize, data });
        })();
    }
    deleteAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            const shstate = _this3.get('shstate');
            const data = {
                shstate: shstate
            };
            yield _this3.model('student').where({ studentID: id }).update(data);
            return _this3.success('成功');
        })();
    }
};
//# sourceMappingURL=student.js.map