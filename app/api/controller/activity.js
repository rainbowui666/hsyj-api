function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
    frontListAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const page = _this.get('pageindex') || 1;
            const size = _this.get('pagesize') || 10;
            const studentid = _this.get('studentid');
            const model = _this.model('activity');
            model._pk = 'activityID';
            const endDate = new Date();
            const date = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' 00:00:00';
            const data = yield model.where({ shstate: 0, endDate: { '>': date } }).page(page, size).countSelect();

            const arrdata = [];

            for (const item of data.data) {
                item.pics = yield _this.model('activity').getPicsbyid(item.activityID);
                // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))
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
                item.needSchoolRangName = yield _this.model('school').getSchoolNameByIds(item.needSchoolRang);
                item.shstate = yield _this.model('activity').getstate(item.activityID);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this.success(data);
        })();
    }

    getactivitydetailAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('id');
            const studentid = _this2.get('studentid');
            const model = _this2.model('activity');
            model._pk = 'activityID';
            const data = yield model.where({ activityID: id }).find();
            if (!think.isEmpty(data)) {
                data.pics = yield _this2.model('activity').getPicsbyid(data.activityID);
                // data.discussList = await this.model('discuss').getDiscussById(id,1);
                data.shstate = yield _this2.model('activity').getstate(data.activityID);
                let joindate = yield _this2.model('student_activity').getStudentIsJoinActivity(studentid, data.activityID);
                if (Number(new Date()) > Number(new Date(data.endDate)) && joindate && joindate.length > 0) {
                    data.hasjoin = '已完成';
                } else if (data.hasjoin = joindate && joindate.length > 0) {
                    data.hasjoin = '已报名';
                } else {
                    data.hasjoin = '';
                }
            }
            return _this2.success(data);
        })();
    }

    getactivitydetailForGroupAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            const studentid = _this3.get('studentid');
            const model = _this3.model('activity');
            model._pk = 'activityID';
            const data = yield model.where({ activityID: id }).find();
            if (!think.isEmpty(data)) {
                data.pics = yield _this3.model('activity').getPicsbyid(data.activityID);
                // data.discussList = await this.model('discuss').getDiscussById(id,1);
                data.shstate = yield _this3.model('activity').getstate(data.activityID);
                let joindate = yield _this3.model('student_activity').getStudentIsJoinActivity(studentid, data.activityID);
                if (Number(new Date()) > Number(new Date(data.endDate)) && joindate && joindate.length > 0) {
                    data.hasjoin = '已完成';
                } else if (data.hasjoin = joindate && joindate.length > 0) {
                    data.hasjoin = '已报名';
                } else {
                    data.hasjoin = '';
                }
                data.group = yield _this3.model('group').where({ activityid: data.activityID }).select();
            }
            return _this3.success(data);
        })();
    }

    getActivityDiscussListAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const id = _this4.get('id');
            const model = _this4.model('activity');
            model._pk = 'activityID';
            const data = yield model.where({ activityID: id }).find();
            if (!think.isEmpty(data)) {
                data.discussList = yield _this4.model('discuss').getDiscussById(id, 1);
            }
            return _this4.success(data);
        })();
    }

    getActivitySceneryListAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this5.get('studentid');
            const model = _this5.model('activity_scenery');
            const pageindex = _this5.get('pageindex') || 1;
            const pagesize = _this5.get('pagesize') || 5;
            const activityid = _this5.get('activityid');
            const idcondition = activityid ? 'a.activityID=' + activityid : '1=1';
            const start = (pageindex - 1) * pagesize;
            const data = yield model.query("select s.*,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s left join culture_activity a on a.activityID=s.activityid left join culture_scenery sc on s.sceneryid=sc.sceneryID where " + idcondition + " and a.activityID limit " + start + "," + pagesize + " ");
            const counta = yield model.query("select count(*) t from (select s.*,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s left join culture_activity a on a.activityID=s.activityid left join culture_scenery sc on s.sceneryid=sc.sceneryID where " + idcondition + " ) t");
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            let arrScen = [];
            let arrSchool = [];
            for (const item of data) {
                item.pics = yield _this5.model('activity').getPicsbyid(item.activityid);
                item.shstate = yield _this5.model('activity').getstate(item.activityid);
                arrScen.push(item.sceneryid);
                arrSchool.push(item.schoolid);
                // item.question = await this.model('student_activity').studentJoinActivityAndAnswer(studentid,item.activityID,item.questionid)
                arrdata.push(item);
            }
            let complateSceneryNum = yield _this5.model('attention_activity').where({ studentid: studentid, activityid: activityid }).count();
            let complateSchoolNum = yield _this5.model('student_school').where({ studentid: studentid, shstate: 1 }).count();
            arrScen = _.uniq(arrScen);
            arrSchool = _.uniq(arrSchool);

            data.data = arrdata;
            return _this5.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, totalScenery: arrScen, totalSchool: arrSchool, complateSceneryNum: complateSceneryNum, complateSchoolNum: complateSchoolNum, data });
        })();
    }

    listAction() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const page = _this6.get('pageindex') || 1;
            const size = _this6.get('pagesize') || 10;
            let userinfo = yield _this6.cache('userinfo');
            console.log('session', userinfo);

            const studentid = _this6.get('studentid');
            const model = _this6.model('activity');
            model._pk = 'activityID';
            const endDate = new Date();
            const date = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' 00:00:00';
            let data = {};
            if (userinfo && userinfo[0].usertype == 0) {
                data = yield model.where({ shstate: 0, endDate: { '>': date }, createbyuserid: userinfo[0].sysUserID }).page(page, size).countSelect();
            } else {
                data = yield model.where({ shstate: 0, endDate: { '>': date } }).page(page, size).countSelect();
            }

            const arrdata = [];

            for (const item of data.data) {
                item.pics = yield _this6.model('activity').getPicsbyid(item.activityID);
                item.sceneryCount = yield _this6.model('activity_scenery').where({ activityid: item.activityID }).count('activityid');
                item.questionCount = 1; //await this.model('question').where({activityid:item.activityID}).count('activityid');
                // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))

                item.needSchoolRangName = yield _this6.model('school').getSchoolNameByIds(item.needSchoolRang);
                // item.shstate = await this.model('activity').getstate(item.activityID);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this6.success(data);
        })();
    }

    list2Action() {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            const page = _this7.get('pageindex') || 1;
            const size = _this7.get('pagesize') || 10;
            let userinfo = yield _this7.cache('userinfo');
            const activityid = _this7.get('activityid');

            const model = _this7.model('question');
            model._pk = 'questionID';
            let list = [];
            if (userinfo && userinfo[0] && userinfo[0].usertype == 0) {
                console.log('aaa');
                let condition = {};
                if (think.isEmpty(activityid)) {
                    condition = { createbyuserid: userinfo[0].sysUserID };
                } else {
                    condition = { 's.activityid': activityid, createbyuserid: userinfo[0].sysUserID };
                }
                list = yield model.field(['q.questionID', 'q.questiontitle', 'q.answera', 'q.answerb', 'q.answerc', 'q.answerd', 'q.rightanswer', 's.sceneryid', 's.activityid', 'cs.sceneryTitle', 'act.startAddress']).alias('q').join({
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
                }).order('activityid desc').where(condition).page(page, size).countSelect();
            } else {
                console.log('bbb');
                let condition = {};
                if (think.isEmpty(activityid)) {
                    condition = { 1: 1 };
                } else {
                    condition['s.activityid'] = activityid;
                }
                list = yield model.field(['q.questionID', 'q.questiontitle', 'q.answera', 'q.answerb', 'q.answerc', 'q.answerd', 'q.rightanswer', 's.sceneryid', 's.activityid', 'cs.sceneryTitle', 'act.startAddress']).alias('q').join({
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
                }).where(condition).order('activityid desc').page(page, size).countSelect();
            }

            return _this7.success(list);
        })();
    }

    getActivityQuestionDetailAction() {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            const questionid = _this8.get('questionid');
            const activityid = _this8.get('activityid');
            const model = _this8.model('question');
            // model._pk = 'questionID';

            let data = yield model.field(['q.questionID', 'q.questiontitle', 'q.answera', 'q.answerb', 'q.answerc', 'q.answerd', 'q.rightanswer', 's.sceneryid', 's.activityid', 'cs.sceneryTitle', 'act.startAddress']).alias('q').join({
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
            }).where({ 'q.questionID': questionid, 's.activityid': activityid }).find();
            return _this8.success(data);
        })();
    }

};
//# sourceMappingURL=activity.js.map