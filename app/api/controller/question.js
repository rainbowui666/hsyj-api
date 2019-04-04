function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    getQuestionbyActidAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            // const model = this.model('question');
            const id = _this.get('id');
            const ac_scmodel = _this.model('activity_scenery');
            const data = yield ac_scmodel.field(['sc.*', 'q.questionTitle', 'q.questionType', 'q.answerA', 'q.answerB', 'q.answerC', 'q.answerD', 'q.rightAnswer']).alias('sc').join({
                table: 'question',
                join: 'left',
                as: 'q',
                on: ['sc.questionid', 'q.questionID']
            }).where({ 'sc.activityid': id }).find();
            return _this.success(data);
        })();
    }
};
//# sourceMappingURL=question.js.map