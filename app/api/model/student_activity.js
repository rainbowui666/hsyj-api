function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');

module.exports = class extends think.Model {
    getActivityHasJoin(studentid, activityid, shstate) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const data = yield _this.model('student_activity').where({ studentID: studentid, activityid: activityid, shstate: shstate }).select();
            return data;
        })();
    }
    // 活动的景点签到
    getStudentIsJoinActivity(studentid, activityid, shstate) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            // 取景点阀值
            const actData = yield _this2.model('activity').field(['activityID', 'needSchoolPass', 'needSceneryPass']).where({ activityID: activityid }).find();
            let needschoolpass = 0;
            let needscenerypass = 0;
            if (!think.isEmpty(actData)) {
                needschoolpass = actData.needSchoolPass;
                needscenerypass = actData.needSceneryPass;
            }

            // 活动景点签到次数
            let realattentscenery = 0;
            let dataScenery = yield _this2.model('attention_activity').field('sceneryid').where({ studentid: studentid, activityid: activityid }).getField('sceneryid');
            if (!think.isEmpty(dataScenery)) {
                realattentscenery = dataScenery.length;
            }

            dataScenery = _.uniq(dataScenery);
            // console.log('dataScenery------',dataScenery)

            // 景点所属学校
            let dataschool = 0;
            if (!think.isEmpty(dataScenery)) {
                dataScenery = dataScenery.join(',');
                dataschool = yield _this2.model('scenery').field('schoolid').where({ sceneryID: ['in', dataScenery] }).getField('schoolid');
                dataschool = _.uniq(dataschool);
                // console.log('schoolid------',dataschool)
            }

            let iscomplate = false;
            if (realattentscenery >= needscenerypass && dataschool && dataschool.length >= needschoolpass) {
                iscomplate = true;
            }

            let isAttentention = false;
            const databm = yield _this2.model('student_activity').where({ studentID: studentid, activityid: activityid, shstate: shstate }).select();
            if (!think.isEmpty(databm) && databm.length > 0) {
                isAttentention = true;
            }

            // if (realattentscenery > 0) {
            //     isAttentention = true;
            // }
            // const data = await this.model('student_activity').where({studentID: studentid, activityid: activityid, shstate: shstate}).select();
            console.log('getActivityHasJoin-----', studentid, activityid, isAttentention, iscomplate);
            return { isAttentention, iscomplate };
        })();
    }

    studentJoinActivityAndAnswer(studentid, activityid, questionid) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const data = yield _this3.model('student_activity').where({ studentID: studentid, activityid: activityid, shstate: 1 }).select();
            const questiondata = yield _this3.model('question').where({ questionID: questionid }).select();

            return {
                data, questiondata
            };
        })();
    }

    getJoinNum(activityid) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const data = yield _this4.model('student_activity').where({ activityid: activityid, shstate: 1 }).select();
            return data ? data.length : 0;
        })();
    }

    // 团体活动每个人都要完成阀值才算完成
    getStudentIsJoinGroup(studentid, activityid, shstate) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            // 取景点阀值和人数
            const actData = yield _this5.model('activity').field(['activityID', 'needSchoolPass', 'needSceneryPass', 'groupNum']).where({ activityID: activityid }).find();
            let needschoolpass = 0;
            let needscenerypass = 0;
            let needgroupnum = 0;
            if (!think.isEmpty(actData)) {
                needschoolpass = actData.needSchoolPass;
                needscenerypass = actData.needSceneryPass;
                needgroupnum = actData.groupNum;
            }

            // 查找有哪些同学签过到, studentid应该包括在内
            let checkindata = yield _this5.model('attention_activity').field('studentid').where({ activityid: activityid }).getField('studentid');
            let strcheckinstudentids = '';
            if (!think.isEmpty(checkindata)) {
                checkindata = _.uniq(checkindata);
                // strcheckinstudentids = checkindata.join(',')
            }

            let arr = [];
            for (let i = 0; i < checkindata.length; i++) {
                // 活动景点签到次数
                let realattentscenery = 0;
                let dataScenery = yield _this5.model('attention_activity').field('sceneryid').where({ studentid: checkindata[i], activityid: activityid }).getField('sceneryid');
                if (!think.isEmpty(dataScenery)) {
                    realattentscenery = dataScenery.length;
                }
                dataScenery = _.uniq(dataScenery);

                // 景点所属学校
                let dataschool = 0;
                let strScenerys = '';
                if (!think.isEmpty(dataScenery)) {
                    strScenerys = dataScenery.join(',');
                    dataschool = yield _this5.model('scenery').field('schoolid').where({ sceneryID: ['in', strScenerys] }).getField('schoolid');
                    dataschool = _.uniq(dataschool);
                    // console.log('schoolid------',dataschool, dataScenery)
                }

                if (checkindata.includes(parseInt(checkindata[i]))) {
                    if (dataScenery.length >= needscenerypass && dataschool.length >= needschoolpass) {
                        arr.push({ studentid: checkindata[i], gosceneries: dataScenery, schoolbelong: dataschool, pass: true });
                    } else {
                        arr.push({ studentid: checkindata[i], gosceneries: dataScenery, schoolbelong: dataschool, pass: false });
                    }
                }
            }

            let isAttentention = false;
            let iscomplate = false;
            if (arr.length >= needgroupnum) {
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i].pass) {
                        iscomplate = false;
                        break;
                    } else {
                        iscomplate = true;
                    }
                }
            }

            // if (checkindata.includes(parseInt(studentid))) {
            const databm = yield _this5.model('student_activity').where({ studentID: studentid, activityid: activityid, shstate: shstate }).select();
            if (!think.isEmpty(databm) && databm.length > 0) {
                isAttentention = true;
            }
            // } else {
            //     iscomplate = false;
            // }


            // const data = await this.model('student_activity').where({studentID: studentid,activityid:activityid,shstate:shstate}).select();
            console.log('getStudentIsJoinGroup-----', arr, isAttentention, iscomplate, needschoolpass, needscenerypass, needgroupnum);
            return { isAttentention, iscomplate };
        })();
    }

    getActiveStatus(studentid, activityid, needscenerypass, needschoolpass, ispass) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            let arr = {};
            // 活动景点签到次数
            let realattentscenery = 0;
            // console.log('getActiveStatus.studentid', studentid)
            let dataScenery = yield _this6.model('attention_activity').field('sceneryid').where({ studentid: studentid, activityid: activityid }).getField('sceneryid');
            if (!think.isEmpty(dataScenery)) {
                realattentscenery = dataScenery.length;
            }
            dataScenery = _.uniq(dataScenery);

            // 景点所属学校
            let dataschool = 0;
            let strScenerys = '';
            if (!think.isEmpty(dataScenery)) {
                strScenerys = dataScenery.join(',');
                dataschool = yield _this6.model('scenery').field('schoolid').where({ sceneryID: ['in', strScenerys] }).getField('schoolid');
                dataschool = _.uniq(dataschool);
                // console.log('schoolid------',dataschool, dataScenery)
            }

            if (think.isEmpty(ispass)) {
                if (dataScenery.length >= needscenerypass && dataschool.length >= needschoolpass) {
                    arr = { studentid: studentid, gosceneries: dataScenery, schoolbelong: dataschool, pass: true };
                } else {
                    arr = { studentid: studentid, gosceneries: dataScenery, schoolbelong: dataschool, pass: false };
                }
            } else {
                arr = { studentid: studentid, gosceneries: dataScenery, schoolbelong: dataschool, pass: ispass };
            }

            return arr;
        })();
    }

    // 团体活动每个人都要完成阀值才算完成
    getStudentIsJoinGroup2(studentid, activityid, shstate) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            // 取景点阀值和人数
            const actData = yield _this7.model('activity').field(['activityID', 'needSchoolPass', 'needSceneryPass', 'groupNum']).where({ activityID: activityid }).find();
            let needschoolpass = 0;
            let needscenerypass = 0;
            let needgroupnum = 0;
            if (!think.isEmpty(actData)) {
                needschoolpass = actData.needSchoolPass;
                needscenerypass = actData.needSceneryPass;
                needgroupnum = actData.groupNum;
            }
            let arr = [];

            // 查找团队
            let groupData = yield _this7.model('group').field(['groupid', 'studentid']).where({ activityid: activityid }).getField('groupid,studentid');
            let groupIds = groupData.groupid;
            let groupcreateid = groupData.studentid;
            // console.log('groupids---', groupIds)
            groupIds = _.uniq(groupIds);

            // 查找团队成员
            if (!think.isEmpty(groupIds)) {
                for (let i = 0; i < groupIds.length; i++) {
                    let groupStudentIds = yield _this7.model('student_group').field('studentid').where({ groupid: groupIds[i], activityid: activityid }).getField('studentid');

                    if (!think.isEmpty(groupStudentIds)) {
                        groupStudentIds = _.uniq(groupStudentIds);
                        let inarr = _.includes(groupStudentIds, parseInt(studentid));
                        console.log('groupStudentIds', groupcreateid, groupStudentIds, inarr);
                        // 是否满足活动团队人数和student是否在团队
                        if (inarr && groupStudentIds.length > 0 && groupStudentIds.length >= needgroupnum) {
                            // 团队创建人是否完成
                            if (!think.isEmpty(groupcreateid) && groupcreateid.length > 0) {
                                for (let j = 0; j < groupcreateid.length; j++) {
                                    let obj = yield _this7.getActiveStatus(groupcreateid[j], activityid, needscenerypass, needschoolpass);
                                    if (obj.pass) {
                                        arr.push(obj);
                                        break; // 团队创建人完成
                                    }
                                }
                            }
                            if (arr.length > 0) {
                                console.log('difference', groupStudentIds, arr[0].studentid);
                                groupStudentIds = _.difference(groupStudentIds, [arr[0].studentid]);
                                console.log('difference.after', groupStudentIds);
                                for (let i = 0; i < groupStudentIds.length; i++) {
                                    arr.push({ studentid: groupStudentIds[i], gosceneries: [], schoolbelong: [], pass: true });
                                }
                            }
                            // arr = await this.getActiveStatus(groupcreateid, activityid, needscenerypass, needschoolpass);
                            // break;
                        } else {
                            console.log('else----', studentid, groupStudentIds, inarr);
                            arr.push({ studentid: studentid, gosceneries: [], schoolbelong: [], pass: false });
                        }
                        console.log('aaaaaaa', arr);
                    }
                }
            }
            // console.log('aaa', arr.length, arr)
            arr = arr.find(function (c) {
                return c.studentid == studentid;
            });
            // console.log('aaa2', arr)

            let isAttentention = false;
            let iscomplate = false;
            // if (arr.length >= needgroupnum) {
            // for (let i = 0; i < arr.length; i++) {
            if (!think.isEmpty(arr)) {
                if (!arr.pass) {
                    iscomplate = false;
                    // break;
                } else {
                    iscomplate = true;
                }
            }
            // }
            // }

            // if (checkindata.includes(parseInt(studentid))) {
            const databm = yield _this7.model('student_activity').where({ studentID: studentid, activityid: activityid, shstate: shstate }).select();
            if (!think.isEmpty(databm) && databm.length > 0) {
                isAttentention = true;
            }
            // } else {
            //     iscomplate = false;
            // }


            // const data = await this.model('student_activity').where({studentID: studentid,activityid:activityid,shstate:shstate}).select();
            console.log('getStudentIsJoinGroup-----', arr, isAttentention, iscomplate, needschoolpass, needscenerypass, needgroupnum);
            return { isAttentention, iscomplate };
        })();
    }
};
//# sourceMappingURL=student_activity.js.map