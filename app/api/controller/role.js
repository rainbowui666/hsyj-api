function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    saveAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const roleData = {
                roleName: _this.get('rolename')
            };

            let id = _this.get('id');
            if (think.isEmpty(id)) {
                yield _this.model('role').add(roleData);
            } else {
                yield _this.model('role').where({ roleID: id }).update(roleData);
            }

            return _this.success('角色添加成功');
        })();
    }

    deleteAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('id');
            yield _this2.model('role').where({ roleID: id }).delete();

            return _this2.success('删除成功');
        })();
    }
};
//# sourceMappingURL=role.js.map