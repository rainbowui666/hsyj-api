function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.get('id');
            const groupname = _this.get('groupname');

            let param = {
                activityid: id,
                groupName: groupname
            };

            const insertid = yield model.add(param);
            return _this.success('添加成功');
        })();
    }
};
//# sourceMappingURL=group.js.map