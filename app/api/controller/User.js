function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    saveAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const userData = {
                userName: _this.get('userName'),
                pwd: _this.get('pwd')
            };

            let id = _this.get('id');
            let roleid = _this.get('roleid');

            if (think.isEmpty(id)) {
                // try {
                // await think.startTrans();
                let insertid = yield _this.model('User').add(userData);
                yield _this.model('user_role').add({ sysuserid: insertid, roleid: roleid });
                //     await this.commit();
                // } catch (e) {
                //     await think.rollback();
                // }
            } else {
                yield _this.model('User').where({ sysUserID: id }).update(userData);
                yield _this.model('user_role').where({ sysuserid: id }).delete();
                yield _this.model('user_role').add({ sysuserid: id, roleid: roleid });
            }

            return _this.success(' success');
        })();
    }

    deleteAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('id');
            yield _this2.model('User').where({ sysUserID: id }).delete();
            yield _this2.model('user_role').where({ sysuserid: id }).delete();
            return _this2.success('删除成功');
        })();
    }
};
//# sourceMappingURL=User.js.map