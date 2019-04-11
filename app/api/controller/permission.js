function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    saveAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const userData = {
                permissionName: _this.get('permissionname')
            };

            let id = _this.get('id');
            let roleid = _this.get('roleid');
            if (think.isEmpty(id)) {

                let insertid = yield _this.model('permission').add(userData);
                yield _this.model('role_permission').add({ permissionid: insertid, roleid: roleid });
            } else {
                yield _this.model('permission').where({ permissionID: id }).update(userData);
                yield _this.model('role_permission').where({ permissionid: id }).delete();
                yield _this.model('role_permission').add({ permissionid: id, roleid: roleid });
            }

            return _this.success(' success');
        })();
    }

    assignSchoolAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('schoolid');
            const permissionid = _this2.get('permissionid');
            const data = {
                schoolid: id,
                permissionid: permissionid
            };
            let insertid = yield _this2.model('permission_school').add(data);
            return _this2.success('分配成功');
        })();
    }

    deleteAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            yield _this3.model('permission').where({ permissionID: id }).delete();

            return _this3.success('删除成功');
        })();
    }
};
//# sourceMappingURL=permission.js.map