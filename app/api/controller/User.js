function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {

    getUserListBySchoolidAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const schoolid = _this.get('schoolid');
            // const data = await this.model('user').where({schoolid:schoolid, shstate: 0}).select();
            const data = yield _this.model('user').field(['schoolid', 'shstate', 'sysUserID', 'userName', 'usertype']).where({ schoolid: schoolid, shstate: 0 }).select();
            return _this.success(data);
        })();
    }
};
//# sourceMappingURL=user.js.map