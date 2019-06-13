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
                data = yield model.where('schoolName like ' + `%${schoolname}%` + ' and shstate = 0 and parentid=0 and parentid=-1').order('schoolID asc').page(page, size).countSelect();
            } else {
                data = yield model.where('areaid=' + areaid + ' and shstate=0 and parentid=0 and parentid=-1').page(page, size).order('schoolID asc').countSelect();
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

    indexOrgListAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const page = _this2.get('pageindex') || 1;
            const size = _this2.get('pagesize') || 10;
            const schoolname = _this2.get('schoolname') || '';
            const areaid = _this2.get('areaid') || '';

            const model = _this2.model('school');
            model._pk = 'schoolID';
            var data;
            if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
                data = yield model.where('shstate=0 and (parentid=0 or parentid=-1)').page(page, size).order('schoolID asc').countSelect();
            } else if (!think.isEmpty(schoolname)) {
                data = yield model.where('schoolName like ' + `%${schoolname}%` + ' and shstate=0 and (parentid=0 or parentid=-1)').order('schoolID asc').page(page, size).countSelect();
            } else {
                data = yield model.where('areaid=' + areaid + ' and shstate=0 and (parentid=0 or parentid=-1)').page(page, size).order('schoolID asc').countSelect();
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

    getSchoolListAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const page = _this3.get('pageindex') || 1;
            const size = _this3.get('pagesize') || 10;
            const schoolname = _this3.get('schoolname') || '';
            const areaid = _this3.get('areaid') || '';
            let userinfo = yield _this3.model('pagecache').getUserInfo(_this3.ctx.state.token, _this3.ctx.state.userId); // await this.cache('userinfo'+ this.ctx.state.token);

            const model = _this3.model('school');
            model._pk = 'schoolID';
            var data;
            if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
                data = yield model.where({ schoolID: userinfo.schoolid }).page(page, size).countSelect();
            } else if (!think.isEmpty(schoolname)) {
                data = yield model.where({ schoolName: ['like', `%${schoolname}%`], schoolID: userinfo.schoolid }).page(page, size).countSelect();
            } else {
                data = yield model.where({ areaid: areaid, schoolID: userinfo.schoolid }).page(page, size).countSelect();
            }

            const arrdata = [];
            for (const item of data.data) {
                item.pics = yield _this3.model('school').getPicsbyid(item.schoolID);
                item.shstate = yield _this3.model('school').getstate(item.schoolID);
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this3.success(data);
        })();
    }

    getAreaAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const data = yield _this4.model('area').select();
            return _this4.success(data);
        })();
    }

    detailAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const id = _this5.get('schoolid');
            const model = _this5.model('school');
            // model._pk = 'schoolID';

            const data = yield model.where({ schoolID: id }).find();

            console.log('userid ctx', _this5.ctx.state.userId);
            const arrdata = [];
            if (!think.isEmpty(data)) {
                // for (const item of data.data) {
                data.scenery = yield _this5.model('school').getScenerybyid(data.schoolID);
                data.schoolpics = yield _this5.model('school').getPicsbyid(data.schoolID);
                data.discussList = yield _this5.model('discuss').getDiscussById(id, 2);
                //     // item.shstate = await this.model('school').getstate(item.schoolID);
                //     arrdata.push(item);
                // }
                // data.data = arrdata;
            }
            return _this5.success(data);
        })();
    }

    getChildSchoolAction() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const id = _this6.get('schoolid');
            const data = yield _this6.model('school').where({ parentid: id }).select();
            return _this6.success(data);
        })();
    }
};
//# sourceMappingURL=school.js.map