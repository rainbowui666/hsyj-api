function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
    getSwipeActAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const model = _this.model('activity');
            model._pk = 'activityID';
            const data = yield model.field(['activityID', 'activityName']).where({ isrecommend: 1, shstate: 0 }).order('activityID desc').limit(0, 5).select();

            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this.model('activity').getPicsbyid(item.activityID);
                item.joinnum = yield _this.model('student_activity').getJoinNum(item.activityID);
                arrdata.push(item);
            }

            return _this.success(data);
        })();
    }
    frontListAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const page = _this2.get('pageindex') || 1;
            const size = _this2.get('pagesize') || 10;
            const studentid = _this2.get('studentid');
            const model = _this2.model('activity');
            model._pk = 'activityID';
            const endDate = new Date();
            const date = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' 00:00:00';
            // endDate:{'>': think.datetime(date,'YYYY-MM-DD')
            const data = yield model.where({ shstate: 0, iscomplate: 1, endDate: { '>': think.datetime(date, 'YYYY-MM-DD') } }).order('activityID desc').page(page, size).countSelect();

            const arrdata = [];

            for (const item of data.data) {
                item.pics = yield _this2.model('activity').getPicsbyid(item.activityID);
                if (!think.isEmpty(studentid)) {

                    // let joindate = await this.model('student_activity').getStudentIsJoinActivity(studentid,item.activityID, 1);
                    let joindate = null;
                    if (item.isGroup == 0) {
                        joindate = yield _this2.model('student_activity').getStudentIsJoinActivity(studentid, item.activityID, 1);
                    } else {
                        joindate = yield _this2.model('student_activity').getStudentIsJoinGroup2(studentid, item.activityID, 1);
                    }

                    let start = Number(new Date(item.startDate));
                    let nowd = Number(new Date());
                    let end = Number(new Date(item.endDate));

                    if (joindate) {
                        console.log('joindate---', joindate, start, nowd, end);
                    }

                    if (joindate && joindate.iscomplate) {
                        item.hasjoin = '已完成';
                    } else if (start < nowd && nowd < end && joindate && joindate.isAttentention) {
                        item.hasjoin = '已报名,进行中';
                    } else if (start < nowd && nowd < end) {
                        item.hasjoin = '进行中';
                    } else if (joindate && joindate.isAttentention) {
                        item.hasjoin = '已报名';
                    }
                } else {
                    let start = Number(new Date(item.startDate));
                    let nowd = Number(new Date());
                    let end = Number(new Date(item.endDate));

                    if (start < nowd && nowd < end) {
                        item.hasjoin = '进行中';
                    } else if (end < nowd) {
                        item.hasjoin = '已结束';
                    } else {
                        item.hasjoin = '未开始';
                    }
                }
                item.needSchoolRangName = yield _this2.model('school').getSchoolNameByIds(item.needSchoolRang);
                item.shstate = yield _this2.model('activity').getstate(item.activityID);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this2.success(data);
        })();
    }

    getactivitydetailAction() {
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
                if (!think.isEmpty(studentid)) {
                    let joindate = null;
                    if (data.isGroup == 0) {
                        joindate = yield _this3.model('student_activity').getStudentIsJoinActivity(studentid, data.activityID, 1);
                    } else {
                        joindate = yield _this3.model('student_activity').getStudentIsJoinGroup2(studentid, data.activityID, 1);
                    }

                    let start = Number(new Date(data.startDate));
                    let nowd = Number(new Date());
                    let end = Number(new Date(data.endDate));

                    if (joindate && joindate.iscomplate) {
                        data.hasjoin = '已完成';
                    } else if (start < nowd && nowd < end && joindate && joindate.isAttentention) {
                        data.hasjoin = '已报名,进行中';
                    } else if (start < nowd && nowd < end) {
                        data.hasjoin = '进行中';
                    } else if (joindate && joindate.isAttentention) {
                        data.hasjoin = '已报名';
                    }
                }
            }
            return _this3.success(data);
        })();
    }

    getactivitydetailForGroupAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const id = _this4.get('id');
            const studentid = _this4.get('studentid');
            const model = _this4.model('activity');
            model._pk = 'activityID';
            const data = yield model.where({ activityID: id }).find();

            if (!think.isEmpty(data)) {
                data.pics = yield _this4.model('activity').getPicsbyid(data.activityID);
                // data.discussList = await this.model('discuss').getDiscussById(id,1);
                data.shstate = yield _this4.model('activity').getstate(data.activityID);
                let joindate = yield _this4.model('student_activity').getStudentIsJoinGroup2(studentid, data.activityID, 1);
                let start = Number(new Date(data.startDate));
                let nowd = Number(new Date());
                let end = Number(new Date(data.endDate));

                if (joindate && joindate.iscomplate) {
                    data.hasjoin = '已完成';
                } else if (start < nowd && nowd < end && joindate && joindate.isAttentention) {
                    data.hasjoin = '已报名,进行中';
                } else if (start < nowd && nowd < end) {
                    data.hasjoin = '进行中';
                } else if (joindate && joindate.isAttentention) {
                    data.hasjoin = '已报名';
                }

                let groupData = yield _this4.model('group').where({ activityid: data.activityID, studentid: studentid }).select();
                data.group = groupData;

                // 团队人数是否到达活动要求人数
                if (!think.isEmpty(groupData)) {
                    let countgroupids = yield _this4.model('student_group').field('studentid').where({ activityid: id, groupid: groupData[0].groupid }).getField('studentid');
                    if (!think.isEmpty(countgroupids)) {
                        countgroupids = _.uniq(countgroupids);
                        data.totalgroupstudents = countgroupids.length;
                    } else {
                        data.totalgroupstudents = 0;
                    }
                } else {
                    data.totalgroupstudents = -1;
                }
            }
            return _this4.success(data);
        })();
    }

    getActivityDiscussListAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const id = _this5.get('id');
            const model = _this5.model('activity');
            model._pk = 'activityID';
            const data = yield model.where({ activityID: id }).find();
            if (!think.isEmpty(data)) {
                data.discussList = yield _this5.model('discuss').getDiscussById(id, 1);
            }
            return _this5.success(data);
        })();
    }

    getActivitySceneryListAction() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this6.get('studentid');
            const model = _this6.model('activity_scenery');
            const pageindex = _this6.get('pageindex') || 1;
            const pagesize = _this6.get('pagesize') || 5;
            const activityid = _this6.get('activityid');
            const idcondition = activityid ? 'a.activityID=' + activityid : '1=1';
            const start = (pageindex - 1) * pagesize;
            const data = yield model.query("select distinct(s.sceneryid),s.activityid,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s inner join culture_activity a on a.activityID=s.activityid inner join culture_scenery sc on s.sceneryid=sc.sceneryID where " + idcondition + " and a.activityID limit " + start + "," + pagesize + " ");
            const counta = yield model.query("select count(*) t from (select distinct(s.sceneryid),s.activityid,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s inner join culture_activity a on a.activityID=s.activityid inner join culture_scenery sc on s.sceneryid=sc.sceneryID where " + idcondition + " ) t");
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            let arrScen = [];
            let arrSchool = [];
            for (const item of data) {
                item.pics = yield _this6.model('activity').getPicsbyid(item.activityid);
                item.shstate = yield _this6.model('activity').getstate(item.activityid);
                item.group = yield _this6.model('student_group').where({ activityid: activityid, studentid: studentid }).select();
                if (!think.isEmpty(studentid)) {
                    item.sceneryState = yield _this6.model('scenery').getstudentstate(item.sceneryid, studentid, item.activityid);
                }

                arrScen.push(item.sceneryid);
                arrSchool.push(item.schoolid);
                // item.question = await this.model('student_activity').studentJoinActivityAndAnswer(studentid,item.activityID,item.questionid)
                arrdata.push(item);
            }
            let complateSceneryNum = 0;
            let complateSchoolNum = 0;
            if (!think.isEmpty(studentid)) {
                complateSceneryNum = yield _this6.model('attention_activity').where({ studentid: studentid, activityid: activityid }).count();
                complateSchoolNum = yield _this6.model('student_school').where({ studentid: studentid, shstate: 1 }).count();
            } else {
                complateSceneryNum = yield _this6.model('attention_activity').where({ activityid: activityid }).count();
                complateSchoolNum = yield _this6.model('student_school').where({ shstate: 1 }).count();
            }
            arrScen = _.uniq(arrScen);
            arrSchool = _.uniq(arrSchool);

            data.data = arrdata;
            return _this6.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, totalScenery: arrScen, totalSchool: arrSchool, complateSceneryNum: complateSceneryNum, complateSchoolNum: complateSchoolNum, data });
        })();
    }

    listAction() {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            const page = _this7.get('pageindex') || 1;
            const size = _this7.get('pagesize') || 10;
            let userinfo = yield _this7.model('pagecache').getUserInfo(_this7.ctx.state.token, _this7.ctx.state.userId); // '+ this.ctx.state.token);
            console.log('session', userinfo);

            const studentid = _this7.get('studentid');
            const model = _this7.model('activity');
            model._pk = 'activityID';
            const endDate = new Date();
            let date = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' 00:00:00';
            // date = '2019-04-14 00:00:00';
            // console.log('list', date)
            let data = {};
            if (userinfo && userinfo.usertype == 0) {
                data = yield model.where({ shstate: 0, endDate: { '>': think.datetime(date, 'YYYY-MM-DD') }, createbyuserid: userinfo.sysUserID }).order('activityID desc').page(page, size).countSelect();
            } else {
                data = yield model.where({ shstate: 0, endDate: { '>': think.datetime(date, 'YYYY-MM-DD') } }).page(page, size).order('activityID desc').countSelect();
            }

            const arrdata = [];

            for (const item of data.data) {
                item.pics = yield _this7.model('activity').getPicsbyid(item.activityID);
                item.sceneryCount = yield _this7.model('activity_scenery').where({ activityid: item.activityID }).count('activityid');
                item.questionCount = 1; //await this.model('question').where({activityid:item.activityID}).count('activityid');
                // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))

                item.needSchoolRangName = yield _this7.model('school').getSchoolNameByIds(item.needSchoolRang);
                item.sceneryRange = yield _this7.model('activity_scenery').getsceneryrangebyid(item.activityID);
                // item.shstate = await this.model('activity').getstate(item.activityID);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this7.success(data);
        })();
    }

    list2Action() {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            const page = _this8.get('pageindex') || 1;
            const size = _this8.get('pagesize') || 10;
            let userinfo = yield _this8.model('pagecache').getUserInfo(_this8.ctx.state.token, _this8.ctx.state.userId); // await this.cache('userinfo'+ this.ctx.state.token);
            const activityid = _this8.get('activityid');

            const model = _this8.model('question');
            model._pk = 'questionID';
            let list = [];
            if (userinfo && userinfo && userinfo.usertype == 0) {
                let condition = {};
                if (think.isEmpty(activityid) || activityid == 'undefined') {
                    condition = { 'act.createbyuserid': userinfo.sysUserID, 'q.shstate': 0, 'cs.shstate': 0, 'act.shstate': 0, 's.questionid': ['!=', null] };
                } else {
                    condition = { 'act.activityid': activityid, 'act.createbyuserid': userinfo.sysUserID, 'q.shstate': 0, 'cs.shstate': 0, 'act.shstate': 0, 's.questionid': ['!=', null] };
                }
                list = yield model.field(['q.questionID', 'q.questiontitle', 'q.answera', 'q.answerb', 'q.answerc', 'q.answerd', 'q.rightanswer', 's.sceneryid', 's.activityid', 'cs.sceneryTitle', 'act.startAddress']).alias('q').join({
                    table: 'activity_scenery',
                    join: 'left',
                    as: 's',
                    on: ['q.sceneryid', 's.sceneryid']
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
                let condition = {};
                if (think.isEmpty(activityid) || activityid == 'undefined') {
                    condition = { 1: 1, 'q.shstate': 0, 'cs.shstate': 0, 'act.shstate': 0, 's.questionid': ['!=', null] };
                } else {
                    condition = { 's.activityid': activityid, 'q.shstate': 0, 'cs.shstate': 0, 'act.shstate': 0, 's.questionid': ['!=', null] };
                }
                list = yield model.field(['q.questionID', 'q.questiontitle', 'q.answera', 'q.answerb', 'q.answerc', 'q.answerd', 'q.rightanswer', 's.sceneryid', 's.activityid', 'cs.sceneryTitle', 'act.startAddress']).alias('q').join({
                    table: 'activity_scenery',
                    join: 'left',
                    as: 's',
                    on: ['q.sceneryid', 's.sceneryid']
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

            return _this8.success(list);
        })();
    }

    getActivityQuestionDetailAction() {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            const questionid = _this9.get('questionid');
            const activityid = _this9.get('activityid');
            const model = _this9.model('question');
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
            return _this9.success(data);
        })();
    }

};
//# sourceMappingURL=activity.js.map