function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    getMyallAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.get('studentid');
            const shstate = _this.get('shstate');
            const data = yield _this.model('student_activity').query("select count(studentID) as attentionSceneryTimes,(select count(studentID) as attentions from culture_attention_activity where studentid=" + id + " and shstate=" + shstate + ") attentionJoinActivityTimes, (select count(studentID) as attentions from culture_student_activity where studentid=" + id + " and shstate=" + shstate + ") attentionBaomingTimes, (select count(studentid) as attent from culture_discuss where studentid=" + id + ") attentionDiscuss from culture_student_scenery where studentid=" + id + " and shstate=" + shstate + "");
            return _this.success(data);
        })();
    }

    getMyAttentionAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('studentid');
            const pageindex = _this2.get('pageindex') || 1;
            const pagesize = _this2.get('pagesize') || 5;
            const start = (pageindex - 1) * pagesize;
            const model = _this2.model('student');
            model._pk = "studentID";

            const data = yield model.query("select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid=" + id + " limit " + start + "," + pagesize + "");
            const counta = yield model.query("select count(*) t from (select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid=" + id + " ) t");
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this2.model('scenery').getPicsbyid(item.sceneryid);
                item.shstate = yield _this2.model('scenery').getstate(item.sceneryid);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this2.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }

    getArrStatu(dataAttendtionIds, studentid) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            // 取景点阀值
            let arrActs = [];
            if (!think.isEmpty(dataAttendtionIds)) {
                for (let i = 0; i < dataAttendtionIds.length; i++) {
                    let actData = yield _this3.model('activity').field(['activityID', 'needSchoolPass', 'needSceneryPass', 'isGroup']).where({ activityID: dataAttendtionIds[i] }).find();
                    let needschoolpass = 0;
                    let needscenerypass = 0;
                    let isgroup = 0;
                    if (!think.isEmpty(actData)) {
                        needschoolpass = actData.needSchoolPass;
                        needscenerypass = actData.needSceneryPass;
                        isgroup = actData.isGroup;
                    }

                    // 活动景点签到次数
                    let realattentscenery = 0;
                    let dataScenery = yield _this3.model('attention_activity').field('sceneryid').where({ studentid: studentid, activityid: dataAttendtionIds[i] }).getField('sceneryid');
                    if (!think.isEmpty(dataScenery)) {
                        realattentscenery = dataScenery.length;
                    }

                    dataScenery = _.uniq(dataScenery);
                    // 景点所属学校
                    let dataschool = 0;
                    if (!think.isEmpty(dataScenery)) {
                        dataScenery = dataScenery.join(',');
                        dataschool = yield _this3.model('scenery').field('schoolid').where({ sceneryID: ['in', dataScenery] }).getField('schoolid');
                        dataschool = _.uniq(dataschool);
                        // console.log('schoolid------',dataschool)
                    }

                    let iscomplate = false;
                    if (isgroup == 0) {
                        // 个人活动
                        if (realattentscenery >= needscenerypass && dataschool && dataschool.length >= needschoolpass) {
                            iscomplate = true;
                        }
                    } else {
                        let joindate = yield _this3.model('student_activity').getStudentIsJoinGroup2(studentid, dataAttendtionIds[i], 1);
                        if (joindate && joindate.iscomplate) {
                            iscomplate = true;
                        }
                    }

                    arrActs.push({ activityid: dataAttendtionIds[i], iscomplate });
                }
            }
            return arrActs;
        })();
    }

    getMyActivityListAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this4.get('studentid');
            const pageindex = _this4.get('pageindex') || 1;
            const pagesize = _this4.get('pagesize') || 5;
            const hasjoin = _this4.get('hasjoin');

            const start = (pageindex - 1) * pagesize;
            const model = _this4.model('student');
            model._pk = "studentID";
            let data = null;
            let counta = null;

            // 参加了哪些活动
            let dataAttendtionIds = yield _this4.model('attention_activity').field('activityid').where({ studentid: studentid }).getField('activityid');
            if (!think.isEmpty(dataAttendtionIds)) {
                dataAttendtionIds = _.uniq(dataAttendtionIds);
            }

            let arrActs = yield _this4.getArrStatu(dataAttendtionIds, studentid);

            const acModel = _this4.model('activity');
            acModel._pk = 'activityID';
            let arr = []; // 已完成
            for (let i = 0; i < arrActs.length; i++) {
                if (arrActs[i].iscomplate) {
                    arr.push(arrActs[i].activityid);
                }
            }

            let arrComp = [];
            let databmids = [];

            if (hasjoin == 0 || hasjoin == 2 && arrActs && arrActs.length > 0) {
                databmids = yield _this4.model('student_activity').field('activityid').where({ studentID: studentid, shstate: 1 }).getField('activityid');
                databmids = _.uniq(databmids);
                arrComp = yield _this4.getArrStatu(databmids, studentid);
            }

            let arr2 = [];
            if (arrActs && arrActs.length > 0) {
                for (let i = 0; i < arrComp.length; i++) {
                    if (arrComp[i].iscomplate) {
                        arr2.push(arrComp[i].activityid);
                    }
                }
            }

            console.log('arr--------', dataAttendtionIds, arr2);
            // 进行中
            if (hasjoin == 1 && dataAttendtionIds && dataAttendtionIds.length > 0) {
                dataAttendtionIds = _.difference(dataAttendtionIds, arr);
                dataAttendtionIds = _.difference(dataAttendtionIds, arr2);
                console.log('进行中------', dataAttendtionIds);
                data = yield acModel.where('endDate > now() and now() > startDate and activityID in (' + dataAttendtionIds.join(',') + ')').order('activityID desc').page(pageindex, pagesize).countSelect();
            } else if (hasjoin == 2) {
                // 已完成

                if (arr2 && arr2.length > 0) {
                    console.log('已完成------', arr2);
                    data = yield acModel.where('activityID in (' + arr2.join(',') + ')').order('activityID desc').page(pageindex, pagesize).countSelect();
                }
            } else if (hasjoin == 0) {
                // 已报名


                // databmids = _.difference(databmids,arr);
                // databmids = _.difference(databmids,dataAttendtionIds);
                let arr3 = [];
                for (let i = 0; i < arrComp.length; i++) {
                    if (!arrComp[i].iscomplate) {
                        arr3.push(arrComp[i].activityid);
                    }
                }
                arr3 = _.difference(arr3, arr2);
                arr3 = _.difference(arr3, dataAttendtionIds);

                // console.log('已报名------', databmids)
                // console.log('已完成------', arr)
                console.log('报名活动------', arr3);
                if (arr3 && arr3.length > 0) {
                    data = yield acModel.where('activityID in (' + arr3.join(',') + ')').order('activityID desc').page(pageindex, pagesize).countSelect();
                }
            }

            const arrdata = [];
            if (!think.isEmpty(data)) {
                for (const item of data.data) {
                    item.pics = yield _this4.model('activity').getPicsbyid(item.activityID);
                    item.shstate = yield _this4.model('activity').getstate(item.activityID);
                    arrdata.push(item);
                }
                data.data = arrdata;
            }
            // return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
            if (!think.isEmpty(data)) {
                return _this4.success(data);
            } else {
                return _this4.success({ count: 0, currentPage: 1, pageSize: pagesize, totalPage: 0, data: [] });
            }
        })();
    }

    getMyDiscussAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this5.get('studentid');
            const pageindex = _this5.get('pageindex') || 1;
            const pagesize = _this5.get('pagesize') || 5;

            const model = _this5.model('discuss');
            model._pk = "discussID";
            const data = yield model.where({ studentid: studentid }).order('discussID desc').page(pageindex, pagesize).countSelect();
            return _this5.success(data);
        })();
    }

    getMySceneryAction() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this6.get('studentid');
            const model = _this6.model('student_scenery');
            let data = null;
            if (!think.isEmpty(studentid)) {
                data = yield model.query("select ss.*,s.sceneryTitle,s.shdesc,s.sctype from culture_student_scenery ss inner join culture_scenery s on ss.sceneryid=s.sceneryid where ss.studentid=" + studentid + " and ss.shstate=1 and ss.sceneryid not in (select targetid from culture_discuss where distype=0 and studentid=" + studentid + ")");
            } else {
                data = yield model.query("select ss.*,s.sceneryTitle,s.shdesc,s.sctype from culture_student_scenery ss inner join culture_scenery s on ss.sceneryid=s.sceneryid where ss.shstate=1 and ss.sceneryid not in (select targetid from culture_discuss where distype=0)");
            }
            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this6.model('scenery').getPicsbyid(item.sceneryid);
                item.shstate = yield _this6.model('scenery').getstate(item.sceneryid);
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this6.success(data);
        })();
    }
};
//# sourceMappingURL=myself.js.map