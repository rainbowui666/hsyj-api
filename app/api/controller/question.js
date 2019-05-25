function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    getQuestionbyActidAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            // const model = this.model('question');
            // const id = this.get('id');
            // const ac_scmodel = this.model('activity_scenery');
            // const data = await ac_scmodel.field(['sc.*','q.questionTitle','q.questionType','q.answerA','q.answerB'
            //     ,'q.answerC','q.answerD','q.rightAnswer'])
            // .alias('sc')
            // .join({
            //     table: 'question',
            //     join:'left',
            //     as: 'q',
            //     on:['sc.questionid','q.questionID']
            // }).where({'sc.activityid':id}).find()
            const activityid = _this.get('activityid');
            const sceneryid = _this.get('sceneryid');

            const model = _this.model('activity_scenery');
            let data = null;
            if (!think.isEmpty(activityid) && !think.isEmpty(sceneryid)) {
                data = yield model.query("select aa.activityid,q.* from culture_activity_scenery aa inner join culture_question q on q.sceneryid=aa.sceneryid where aa.activityid=" + activityid + " and aa.sceneryid=" + sceneryid);
            } else if (!think.isEmpty(activityid)) {
                data = yield model.query("select aa.activityid,q.* from culture_activity_scenery aa inner join culture_question q on q.sceneryid=aa.sceneryid where aa.activityid=" + activityid);
            } else if (!think.isEmpty(sceneryid)) {
                data = yield model.query("select aa.activityid,q.* from culture_activity_scenery aa inner join culture_question q on q.sceneryid=aa.sceneryid where aa.sceneryid=" + sceneryid);
            }
            return _this.success(data);
        })();
    }
};
//# sourceMappingURL=question.js.map