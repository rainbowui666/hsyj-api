function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');

module.exports = class extends think.Model {
    getPicsbyid(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const data = yield _this.model('source').where({ sourceType: 1, targetid: id }).select();
            return data;
        })();
    }

    getstate(id) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const model = _this2.model('student_scenery');
            model._pk = 'sceneryid';
            // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
            const wantto = yield model.where({ sceneryid: id, shstate: 0 }).count('sceneryid');
            // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

            const modeldis = _this2.model('discuss');
            modeldis._pk = 'discussID';
            const disnum = yield modeldis.where({ distype: 0, targetid: id, shstate: 1 }).count('discussID');
            return {
                // checkin: checkin,
                wantto: wantto,
                // sharenum: sharenum,
                disnum: disnum
            };
        })();
    }

    getstudentstate(sceneryid, studentid, activityid) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const model = _this3.model('student_scenery');
            model._pk = 'sceneryid';
            // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
            const wantto = yield model.where({ sceneryid: sceneryid, shstate: 0, studentid: studentid }).count('sceneryid');
            let checkin = 0;
            if (!think.isEmpty(activityid)) {
                checkin = yield _this3.model('attention_activity').where({ studentid: studentid, sceneryid: sceneryid, activityid: activityid }).count('sceneryid');
            } else {
                checkin = yield model.where({ sceneryid: sceneryid, shstate: 1, studentid: studentid }).count('sceneryid');
            } // 
            // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

            const modeldis = _this3.model('discuss');
            modeldis._pk = 'discussID';
            const disnum = yield modeldis.where({ distype: 0, targetid: sceneryid, shstate: 1, studentid: studentid }).count('discussID');
            return {
                // checkin: checkin,
                wantto: wantto,
                checkin,
                // sharenum: sharenum,
                disnum: disnum
            };
        })();
    }

    getactivitystudentstate(sceneryid, studentid, activityid) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const model = _this4.model('student_scenery');
            model._pk = 'sceneryid';
            // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
            const wantto = yield model.where({ sceneryid: sceneryid, shstate: 0, studentid: studentid }).count('sceneryid');
            const checkin = yield _this4.model('attention_activity').where({ sceneryid: sceneryid, shstate: 1, studentid: studentid, activityid: activityid }).count('sceneryid');
            // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

            const modeldis = _this4.model('discuss');
            modeldis._pk = 'discussID';
            const disnum = yield modeldis.where({ distype: 0, targetid: sceneryid, shstate: 1, studentid: studentid }).count('discussID');
            return {
                // checkin: checkin,
                wantto: wantto,
                checkin,
                // sharenum: sharenum,
                disnum: disnum
            };
        })();
    }

    getTopScenery(id) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const activitys = yield _this5.query('select sceneryid,count(sceneryid) num  from culture_attention_activity where activityid=' + id + ' GROUP BY sceneryid  order by num desc limit 5');
            const topActive = [];

            for (const activity of activitys) {
                const name = yield _this5.model('scenery').where({ sceneryID: activity.sceneryid }).find();
                topActive.push({
                    name: name.sceneryTitle,
                    num: activity.num
                });
            }
            return topActive;
        })();
    }

    getTopGroupStudent(stuid, id) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const nums = yield _this6.query('select count(DISTINCT sceneryid) num, min(createdate) time ,max(createdate) mtime  from culture_attention_activity where studentid=' + stuid + ' and activityid=' + id + '');
            return nums;
        })();
    }
};
//# sourceMappingURL=scenery.js.map