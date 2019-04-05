function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.post('id');
            const groupname = _this.post('groupname');

            let param = {
                activityid: id,
                groupName: groupname
            };

            const insertid = yield _this.model('group').add(param);
            return _this.success('添加成功');
        })();
    }

    joinGroupAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const groupid = _this2.get('groupid');
            const studentid = _this2.get('studentid');
            const activityid = _this2.get('activityid');
            let para = {
                groupid, studentid, activityid
            };

            let insertid = yield _this2.model('student_group').add(para);
            return _this2.success('加入成功');
        })();
    }
};
//# sourceMappingURL=group.js.map