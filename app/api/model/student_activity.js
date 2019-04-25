function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');

module.exports = class extends think.Model {
    getStudentIsJoinActivity(studentid, activityid) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const data = yield _this.model('student_activity').where({ studentID: studentid, activityid: activityid }).select();

            return data;
        })();
    }

    studentJoinActivityAndAnswer(studentid, activityid, questionid) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const data = yield _this2.model('student_activity').where({ studentID: studentid, activityid: activityid, shstate: 1 }).select();
            const questiondata = yield _this2.model('question').where({ questionID: questionid }).select();

            return {
                data, questiondata
            };
        })();
    }

    getJoinNum(activityid) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const data = yield _this3.model('student_activity').where({ activityid: activityid, shstate: 1 }).select();
            return data ? data.length : 0;
        })();
    }
};
//# sourceMappingURL=student_activity.js.map