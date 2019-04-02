function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    frontListAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const page = _this.get('page') || 1;
            const size = _this.get('size') || 10;
            const studentid = _this.get('studentid');
            const model = _this.model('activity');
            model._pk = 'activityID';
            const endDate = new Date();
            const date = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' 00:00:00';
            const data = yield model.where({ shstate: 0, endDate: { '>': date } }).page(page, size).countSelect();

            const arrdata = [];

            for (const item of data.data) {
                item.pics = yield _this.model('activity').getPicsbyid(item.activityID);
                console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)));
                if (Number(new Date(item.startDate)) <= Number(new Date()) <= Number(new Date(item.endDate))) {
                    item.status = '进行中';
                } else {
                    item.status = '';
                }
                let joindate = yield _this.model('student_activity').getStudentIsJoinActivity(studentid, item.activityID);
                if (Number(new Date()) > Number(new Date(item.endDate)) && joindate && joindate.length > 0) {
                    item.hasjoin = '已完成';
                } else if (item.hasjoin = joindate && joindate.length > 0) {
                    item.hasjoin = '已报名';
                } else {
                    item.hasjoin = '';
                }
                item.shstate = yield _this.model('activity').getstate(item.activityID);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this.success(data);
        })();
    }
    list2Action() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const page = _this2.get('page') || 1;
            const size = _this2.get('size') || 10;

            const model = _this2.model('question');
            model._pk = 'questionID';
            const list = yield model.field(['q.questionID', 'q.questiontitle', 'q.answera', 'q.answerb', 'q.answerc', 'q.answerd', 'q.rightanswer', 's.sceneryid', 's.activityid', 'cs.sceneryTitle', 'act.startAddress']).alias('q').join({
                table: 'activity_scenery',
                join: 'left',
                as: 's',
                on: ['q.questionID', 's.questionID']
            }).join({
                table: 'scenery',
                join: 'left',
                as: 'cs',
                on: ['cs.sceneryid', 's.sceneryid']
            }).join({
                table: 'activity',
                join: 'left',
                as: 'act',
                on: ['act.activityID', 's.activityid']
            }).page(page, size).countSelect();

            return _this2.success(list);
        })();
    }

    addEdit1Action() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const activityName = _this3.post('activityname');
            const sponsor = _this3.post('sponsor') || '';
            const meetingPlace = _this3.post('meetingplace') || '';
            const secondSponsor = _this3.post('secondsponsor') || '';
            const needSchoolRang = _this3.post('needschoolrang');

            const startDate = _this3.post('startdate');
            const endDate = _this3.post('enddate');
            const shdesc = _this3.post('shdesc');

            const shstate = _this3.post('shstate');
            const startAddress = _this3.post('startaddress');
            const needSchoolPass = _this3.post('needschoolpass');
            const needSceneryPass = _this3.post('needscenerypass');
            const settingStart = _this3.post('settingstart');
            const startSceneryid = _this3.post('startsceneryid');

            const settingEnd = _this3.post('settingend');
            const endSceneryid = _this3.post('endsceneryid');
            const isGroup = _this3.post('isgroup');
            const groupNum = _this3.post('groupnum');

            const id = _this3.get('id');

            let param = {
                activityName,
                sponsor,
                meetingPlace,
                secondSponsor,
                needSchoolRang,
                startDate,
                endDate,
                shdesc,
                shstate,
                startAddress,
                needSchoolPass,
                needSceneryPass,
                settingStart,
                startSceneryid,
                settingEnd,
                endSceneryid,
                isGroup,
                groupNum
            };
            if (think.isEmpty(id)) {
                let model = _this3.model('activity');
                const insertid = yield model.add(param);

                // 上传活动图片
                if (insertid) {
                    return _this3.json({
                        insertid: insertid
                    });
                }
            } else {
                // 1 删除source, 2修改
                yield _this3.model('source').where({ targetid: id }).delete();
                yield _this3.model('activity').where({ activityID: id }).update(param);
                return _this3.success('活动修改成功');
            }
        })();
    }

    addEdit2Action() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const sceneryid = _this4.post('sceneryid');
            const questiontitle = _this4.post('questiontitle');
            const questiontype = _this4.post('questiontype') || 0;
            const answera = _this4.post('answera');
            const answerb = _this4.post('answerb');
            const answerc = _this4.post('answerc');
            const answerd = _this4.post('answerd');
            const rightanswer = _this4.post('rightanswer');
            const id = _this4.get('id');
            const activityid = _this4.get('activityid');

            const questionData = {
                sceneryid: sceneryid,
                questionTitle: questiontitle,
                questionType: questiontype,
                answerA: answera,
                answerB: answerb,
                answerC: answerc,
                answerD: answerd,
                rightAnswer: rightanswer
            };

            if (think.isEmpty(id)) {
                const questId = yield _this4.model('question').add(questionData);
                if (questId) {
                    yield _this4.model('activity_scenery').add({
                        sceneryid, questionid: questId, activityid: activityid
                    });
                }
                return _this4.success('第二步成功');
            } else {
                yield _this4.model('activity_scenery').where({ questionid: id }).delete();
                yield _this4.model('question').where({ questionID: id }).update(questionData);
                yield _this4.model('activity_scenery').add({
                    sceneryid, questionid: id, activityid: activityid
                });
                return _this4.success('修改成功');
            }
        })();
    }

    deleteAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const id = _this5.get('id');
            const data = {
                shstate: 1
            };
            yield _this5.model('activity').where({ activityID: id }).update(data);
            return _this5.success('活动删除成功');
        })();
    }

    delete2Action() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const id = _this6.get('id');
            const data = {
                shstate: 1
            };
            yield _this6.model('question').where({ questionID: id }).update(data);
            return _this6.success('活动第二步问题删除成功');
        })();
    }
};
//# sourceMappingURL=activity.js.map