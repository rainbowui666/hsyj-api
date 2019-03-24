function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    saveAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const userData = {
                permissionid: _this.get('permissionid'),
                roleid: _this.get('roleid')
            };

            let permissionid = _this.get('permissionid');
            let roleid = _this.get('roleid');
            if (!think.isEmpty(permissionid) && !think.isEmpty(roleid)) {
                yield _this.model('role_permission').add(userData);
            }

            return _this.success(' success');
        })();
    }

    // async deleteAction() {
    //     const id = this.get('id');
    //     await this.model('permission').where({permissionID: id}).delete();

    //     return this.success('删除成功')
    // }
};
//# sourceMappingURL=role_permission.js.map