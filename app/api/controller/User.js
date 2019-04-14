function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    saveAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const userData = {
                userName: _this.post('userName'),
                pwd: _this.post('pwd'),
                usertype: _this.post('usertype') || 0,
                schoolid: _this.post('schoolid') || '',
                shstate: _this.post('shstate') || 0
            };

            let id = _this.get('userid');
            // let roleid = this.get('roleid');

            if (think.isEmpty(id)) {
                // try {
                // await think.startTrans();
                let insertid = yield _this.model('User').add(userData);
                // await this.model('user_role').add({sysuserid: insertid, roleid: roleid});
                //     await this.commit();
                // } catch (e) {
                //     await think.rollback();
                // }
            } else {
                yield _this.model('User').where({ sysUserID: id }).update(userData);
                // await this.model('user_role').where({sysuserid: id}).delete();
                // await this.model('user_role').add({sysuserid: id, roleid: roleid});
            }

            return _this.success(' success');
        })();
    }

    getUserListBySchoolidAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const schoolid = _this2.get('schoolid');
            const data = yield _this2.model('User').where({ schoolid: schoolid }).select();
            return _this2.success(data);
        })();
    }

    deleteAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('userid');
            yield _this3.model('User').where({ sysUserID: id }).delete();
            // await this.model('user_role').where({sysuserid: id}).delete();
            return _this3.success('删除成功');
        })();
    }
};
//# sourceMappingURL=user.js.map