function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const studentID = _this.get('studentid');
            const activityid = _this.get('activityid');
            const shstate = _this.get('shstate');
            let data = {
                studentID, activityid, shstate
            };
            const insertid = yield _this.model('student_activity').add(data);
            yield _this.cache('home_activity_scenery', null, 'redis');
            return _this.success('活动签到成功');
        })();
    }
};
//# sourceMappingURL=student_activity.js.map