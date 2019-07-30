function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.post('id');
            const groupname = _this.post('groupname');
            const studentid = _this.post('studentid');

            if (think.isEmpty(groupname)) {
                return _this.fail('团队名称必填');
            }

            // 有没有加入团队
            const groupstudnetData = yield _this.model('student_group').where({ activityid: id, studentid: studentid }).select();
            if (!think.isEmpty(groupstudnetData)) {
                // console.log('groupstudnetData', groupstudnetData)
                // groupstudnetData.groupname = await this.model('group').field('groupName').where({groupID: groupstudnetData[0].groupid}).find()
                return _this.fail('你已加入过团队,不能再创建团队');
            }

            const dataExsts = yield _this.model('group').where({ groupName: groupname }).select();
            if (dataExsts && dataExsts.length > 0) {
                return _this.fail('团队名称被抢注,请更换');
            }
            let param = {
                activityid: id,
                groupName: groupname,
                studentid: studentid
            };

            const insertid = yield _this.model('group').add(param);
            if (!think.isEmpty(insertid)) {
                let para2 = {
                    groupid: insertid, studentid: studentid, activityid: id
                };
                let insertidgr = yield _this.model('student_group').add(para2);
            }
            return _this.success('添加成功');
        })();
    }

    readyScanAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this2.get('studentid');
            _this2.cache('scan' + studentid, studentid);
            // console.log('readyScanAction-------------------')
            return _this2.success({ 'scan': studentid });
        })();
    }

    showGroupAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const groupid = _this3.get('groupid');
            return _this3.success({ groupid: groupid });
        })();
    }

    joinGroupAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const groupid = _this4.get('groupid');
            const studentid = _this4.get('studentid');
            const activityid = _this4.get('activityid');
            let para = {
                groupid, studentid, activityid
            };

            const hasCreateGroup = yield _this4.model('group').where({ groupid: groupid, studentid: studentid, activityid: activityid }).select();
            if (!think.isEmpty(hasCreateGroup)) {
                return _this4.fail('你已创建团队,不能再加入团队');
            }
            const hasjoinData = yield _this4.model('student_group').field('studentid').where({ activityID: activityid, studentid: studentid }).getField('studentid');
            if (!think.isEmpty(hasjoinData)) {
                return _this4.fail('你已加过团队,不能再加入团队');
            }

            const scanstudnetid = yield _this4.cache('scan' + studentid);
            // console.log('joinGroup.scanstudnetid-----', scanstudnetid, groupid,studentid,activityid)
            if (!think.isEmpty(scanstudnetid)) {
                _this4.cache('scan' + studentid, null);

                const actData = yield _this4.model('activity').field(['activityID', 'groupNum']).where({ activityID: activityid }).find();
                let groupnum = 0;
                if (!think.isEmpty(actData)) {
                    groupnum = parseInt(actData.groupNum);
                }

                let groupcount = yield _this4.model('student_group').field('studentid').where({ activityID: activityid, groupid: groupid }).getField('studentid');
                groupcount = _.uniq(groupcount);
                console.log('groupcount=====', groupcount, groupnum);
                if (groupcount.length >= groupnum) {
                    return _this4.fail('加入失败, 超过团体活动最大限制人数');
                } else {
                    console.log('joingroup------', groupid, studentid, activityid);
                    // console.log('success group----')
                    let insertid = yield _this4.model('student_group').add(para);
                    const groupdate = yield _this4.model('group').where({ groupid: groupid }).find();

                    // 报名
                    let hasbaomin = yield _this4.model('student_activity').where({ activityid: activityid, studentID: studentid }).find();
                    if (think.isEmpty(hasbaomin)) {
                        let para3 = {
                            studentID: studentid, activityid: activityid, shstate: 1
                        };
                        let insertid2 = yield _this4.model('student_activity').add(para3);
                    }
                    return _this4.success({ msg: '扫码加入成功', groupName: groupdate.groupName });
                }
            } else {
                return _this4.display('pages/groupSuccess');
            }
        })();
    }

    showQrAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const url = _this5.get('url');
            const studentid = _this5.get('studentid');
            const activityid = _this5.get('activityid');

            console.log('showqr', url, studentid, activityid);

            const qrService = _this5.service('qr', 'api');
            _this5.type = 'image/svg+xml';
            _this5.body = qrService.getQrByUrl(url + '&studentid=' + studentid + '&activityid=' + activityid);
        })();
    }
};
//# sourceMappingURL=group.js.map