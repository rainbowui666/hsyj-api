function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addEditAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.post('id');
            const groupname = _this.post('groupname');
            const studentid = _this.post('studentid');

            let param = {
                activityid: id,
                groupName: groupname,
                studentid: studentid
            };

            const insertid = yield _this.model('group').add(param);
            return _this.success('添加成功');
        })();
    }

    readyScanAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this2.get('studentid');
            _this2.cache('scan' + studentid, studentid);
            return _this2.success({ 'scan': studentid });
        })();
    }

    joinGroupAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const groupid = _this3.get('groupid');
            const studentid = _this3.get('studentid');
            const activityid = _this3.get('activityid');
            let para = {
                groupid, studentid, activityid
            };

            const scanstudnetid = yield _this3.cache('scan' + studentid);
            if (!think.isEmpty(scanstudnetid)) {
                _this3.cache('scan' + studentid, null);

                const actData = yield _this3.model('activity').field(['activityID', 'groupNum']).where({ activityID: activityid }).find();
                let groupnum = 0;
                if (!think.isEmpty(actData)) {
                    groupnum = parseInt(actData.groupNum);
                }

                const groupcount = yield _this3.model('student_group').where({ activityID: activityid }).count();
                if (groupcount >= groupnum) {
                    // console.log('fail group----')
                    return _this3.fail('加入失败, 超过团体活动最大限制人数');
                } else {
                    console.log('joingroup------', groupid, studentid, activityid);
                    // console.log('success group----')
                    let insertid = yield _this3.model('student_group').add(para);
                    return _this3.success('扫码加入成功');
                }
            } else {
                return _this3.display('pages/groupSuccess');
            }
        })();
    }

    showQrAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const url = _this4.get('url');
            const studentid = _this4.get('studentid');
            const activityid = _this4.get('activityid');

            console.log('showqr', url, studentid, activityid);

            const qrService = _this4.service('qr', 'api');
            _this4.type = 'image/svg+xml';
            _this4.body = qrService.getQrByUrl(url + '&studentid=' + studentid + '&activityid=' + activityid);
        })();
    }
};
//# sourceMappingURL=group.js.map