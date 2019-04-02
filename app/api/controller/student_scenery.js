function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const studentid = _this.get('studentid');
            const sceneryid = _this.get('sceneryid');
            const shstate = _this.get('shstate');
            let data = {
                studentid, sceneryid, shstate
            };
            const insertid = yield _this.model('student_scenery').add(data);

            return _this.success('添加成功');
        })();
    }
};
//# sourceMappingURL=student_scenery.js.map