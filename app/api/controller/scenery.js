function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    indexAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const page = _this.get('pageindex') || 1;
            const size = _this.get('pagesize') || 10;
            const scenerytitle = _this.get('scenerytitle') || '';

            const model = _this.model('scenery');
            model._pk = 'sceneryID';

            var data;
            if (scenerytitle == '') {
                data = yield model.where({ shstate: 0 }).page(page, size).order('sceneryID desc').countSelect();
            } else {
                data = yield model.where({ sceneryTitle: ['like', `%${scenerytitle}%`], shstate: 0 }).order('sceneryID desc').page(page, size).countSelect();
            }
            const arrdata = [];
            for (const item of data.data) {
                item.pics = yield _this.model('scenery').getPicsbyid(item.sceneryID);
                item.shstate = yield _this.model('scenery').getstate(item.sceneryID);
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this.success(data);
        })();
    }

    getSceneryListBySchoolidsAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const schoolids = _this2.get('schoolids');
            const data = yield _this2.model('scenery').where({ schoolid: ['IN', schoolids] }).select();
            return _this2.success(data);
        })();
    }

    getscenerydetailAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            const studentid = _this3.get('studentid');
            const model = _this3.model('scenery');
            model._pk = 'sceneryID';
            const data = yield model.where({ sceneryID: id }).find();
            if (!think.isEmpty(data)) {
                data.pics = yield _this3.model('scenery').getPicsbyid(data.sceneryID);
                data.shstate = yield _this3.model('scenery').getstudentstate(data.sceneryID, studentid);
                data.discussList = yield _this3.model('discuss').getDiscussById(id, 0);
            }
            return _this3.success(data);
        })();
    }

    getActivitySceneryDetailAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const id = _this4.get('sceneryid');
            const studentid = _this4.get('studentid');
            const activityid = _this4.get('activityid');

            const model = _this4.model('scenery');
            model._pk = 'sceneryID';
            const data = yield model.where({ sceneryID: id }).find();
            if (!think.isEmpty(data)) {
                data.pics = yield _this4.model('scenery').getPicsbyid(data.sceneryID);
                data.shstate = yield _this4.model('scenery').getactivitystudentstate(data.sceneryID, studentid, activityid);
                data.discussList = yield _this4.model('discuss').getDiscussById(id, 0);
            }
            return _this4.success(data);
        })();
    }

    getUnsignCountExceptEndSceneryAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const activityid = _this5.get('activityid');
            const groupid = _this5.get('groupid');
            const model = _this5.model('scenery');
            const count = yield model.query("select count(*) unsigncount from culture_activity_scenery cas left join culture_activity a on cas.activityid=a.activityid left join culture_group g on g.activityid=cas.activityid left join culture_attention_activity aa on aa.studentid=g.studentid and aa.activityid=g.activityid and aa.sceneryid=cas.sceneryid  where a.activityid=" + activityid + " and g.groupid=" + groupid + " and cas.sceneryid<>a.endSceneryid and a.endSceneryid is not null and aa.createdate is null");
            return _this5.success(count);
        })();
    }

    getPersonUnsignCountExceptEndSceneryAction() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const activityid = _this6.get('activityid');
            const studentid = _this6.get('studentid');
            const model = _this6.model('scenery');
            const count = yield model.query("select count(*) unsigncount from culture_activity_scenery cas left join culture_activity a on a.activityid=cas.activityid left join culture_attention_activity aa on aa.activityid=cas.activityid and aa.sceneryid=cas.sceneryid and aa.studentid=" + studentid + " where a.activityid=" + activityid + " and cas.sceneryid<>a.endSceneryid and a.endSceneryid is not null and aa.createdate is null");
            return _this6.success(count);
        })();
    }

    detailAction() {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            const id = _this7.get('id');
            const model = _this7.model('scenery');
            const data = yield model.where({ sceneryID: id }).find();

            const arrdata = [];
            // for (const item of data.data) {
            data.scenery = yield _this7.model('school').getScenerybyid(data.sceneryID);
            //     // item.shstate = await this.model('school').getstate(item.schoolID);
            //     arrdata.push(item);
            // }
            // data.data = arrdata;
            return _this7.success(data);
        })();
    }

};
//# sourceMappingURL=scenery.js.map