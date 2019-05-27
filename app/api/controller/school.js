function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    indexAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const page = _this.get('pageindex') || 1;
            const size = _this.get('pagesize') || 10;
            const schoolname = _this.get('schoolname') || '';
            const areaid = _this.get('areaid') || '';

            const model = _this.model('school');
            model._pk = 'schoolID';
            var data;
            if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
                data = yield model.where({ shstate: 0 }).page(page, size).order('schoolID asc').countSelect();
            } else if (!think.isEmpty(schoolname)) {
                data = yield model.where({ schoolName: ['like', `%${schoolname}%`], shstate: 0 }).order('schoolID asc').page(page, size).countSelect();
            } else {
                data = yield model.where({ areaid: areaid, shstate: 0 }).page(page, size).order('schoolID asc').countSelect();
            }

            const arrdata = [];
            for (const item of data.data) {
                item.pics = yield _this.model('school').getPicsbyid(item.schoolID);
                item.shstate = yield _this.model('school').getstate(item.schoolID);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this.success(data);
        })();
    }

    getSchoolListAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const page = _this2.get('pageindex') || 1;
            const size = _this2.get('pagesize') || 10;
            const schoolname = _this2.get('schoolname') || '';
            const areaid = _this2.get('areaid') || '';
            let userinfo = yield _this2.cache('userinfo');

            const model = _this2.model('school');
            model._pk = 'schoolID';
            var data;
            if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
                data = yield model.where({ schoolID: userinfo[0].schoolid }).page(page, size).countSelect();
            } else if (!think.isEmpty(schoolname)) {
                data = yield model.where({ schoolName: ['like', `%${schoolname}%`], schoolID: userinfo[0].schoolid }).page(page, size).countSelect();
            } else {
                data = yield model.where({ areaid: areaid, schoolID: userinfo[0].schoolid }).page(page, size).countSelect();
            }

            const arrdata = [];
            for (const item of data.data) {
                item.pics = yield _this2.model('school').getPicsbyid(item.schoolID);
                item.shstate = yield _this2.model('school').getstate(item.schoolID);
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this2.success(data);
        })();
    }

    getAreaAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const data = yield _this3.model('area').select();
            return _this3.success(data);
        })();
    }

    detailAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const id = _this4.get('schoolid');
            const model = _this4.model('school');
            // model._pk = 'schoolID';

            const data = yield model.where({ schoolID: id }).find();

            console.log('userid ctx', _this4.ctx.state.userId);
            const arrdata = [];
            if (!think.isEmpty(data)) {
                // for (const item of data.data) {
                data.scenery = yield _this4.model('school').getScenerybyid(data.schoolID);
                data.schoolpics = yield _this4.model('school').getPicsbyid(data.schoolID);
                data.discussList = yield _this4.model('discuss').getDiscussById(id, 2);
                //     // item.shstate = await this.model('school').getstate(item.schoolID);
                //     arrdata.push(item);
                // }
                // data.data = arrdata;
            }
            return _this4.success(data);
        })();
    }

    getChildSchoolAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const id = _this5.get('schoolid');
            const data = yield _this5.model('school').where({ parentid: id }).select();
            return _this5.success(data);
        })();
    }
};
//# sourceMappingURL=school.js.map