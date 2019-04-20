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
                data = yield model.where({ shstate: 0 }).page(page, size).order('schoolID desc').countSelect();
            } else if (!think.isEmpty(schoolname)) {
                data = yield model.where({ schoolName: ['like', `%${schoolname}%`], shstate: 0 }).order('schoolID desc').page(page, size).countSelect();
            } else {
                data = yield model.where({ areaid: areaid, shstate: 0 }).page(page, size).order('schoolID desc').countSelect();
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

            const arrdata = [];
            if (!think.isEmpty(data)) {
                // for (const item of data.data) {
                data.scenery = yield _this4.model('school').getScenerybyid(data.schoolID);
                data.discussList = yield _this4.model('discuss').getDiscussById(id, 2);
                //     // item.shstate = await this.model('school').getstate(item.schoolID);
                //     arrdata.push(item);
                // }
                // data.data = arrdata;
            }
            return _this4.success(data);
        })();
    }

    deleteAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const id = _this5.get('id');
            const data = {
                shstate: 1
            };
            yield _this5.model('school').where({ schoolID: id }).update(data);
            return _this5.success('学校删除成功');
        })();
    }

    addEditAction() {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const schoolname = _this6.post('schoolname');
            const province = _this6.post('province') || '';
            const city = _this6.post('city') || '';
            const address = _this6.post('address') || '';
            const schooldesc = _this6.post('schooldesc');
            const longitude = _this6.post('longitude');
            const latitude = _this6.post('latitude');
            const soundurl = _this6.post('soundurl');
            const videourl = _this6.post('videourl');
            const areaid = _this6.post('areaid');
            const parentid = _this6.post('parentid') || 0;
            const id = _this6.get('id');
            let userinfo = yield _this6.cache('userinfo');

            let param = {
                schoolName: schoolname,
                province: province,
                city: city,
                address: address,
                schooldesc: schooldesc,
                longitude: longitude,
                latitude: latitude,
                soundurl,
                videourl, areaid, parentid,
                createbyuserid: userinfo[0].sysUserID
            };
            if (think.isEmpty(id)) {
                let model = _this6.model('school');
                const insertid = yield model.add(param);

                // 上传学校图片
                if (insertid) {
                    // const sourceaddress = this.post('sourceaddress');
                    // const insertid2 = await this.model('source').add({
                    //     sourceType:0,
                    //     sourceAddress: sourceaddress,
                    //     targetid: insertid
                    // });
                    return _this6.json({
                        insertid: insertid
                    });
                }
            } else {
                // 1 删除source, 2修改
                yield _this6.model('source').where({ targetid: id }).delete();
                yield _this6.model('school').where({ schoolID: id }).update(param);
                return _this6.success('学校修改成功');
            }
        })();
    }
};
//# sourceMappingURL=school.js.map