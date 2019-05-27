function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    saveAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const userData = {
                sysuserid: _this.get('sysuserid'),
                roleid: _this.get('roleid')
            };

            let sysuserid = _this.get('sysuserid');
            let roleid = _this.get('roleid');
            if (!think.isEmpty(sysuserid) && !think.isEmpty(roleid)) {
                yield _this.model('user_role').add(userData);
            }
            // if (think.isEmpty(id)) {
            //     await this.model('permission').add(userData);
            // } else {
            //     await this.model('permission').where({permissionID: id}).update(userData);
            // }

            return _this.success(' success');
        })();
    }

    // async deleteAction() {
    //     const id = this.get('id');
    //     await this.model('permission').where({permissionID: id}).delete();

    //     return this.success('删除成功')
    // }
};