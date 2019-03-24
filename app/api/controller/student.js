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

    deleteAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('id');
            const shstate = _this2.get('shstate');
            const data = {
                shstate: shstate
            };
            yield _this2.model('student').where({ studentID: id }).update(data);
            return _this2.success('成功');
        })();
    }
};
//# sourceMappingURL=student.js.map