function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    indexAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const page = _this.get('page') || 1;
            const size = _this.get('size') || 10;
            const schoolname = _this.get('schoolname') || '';

            const model = _this.model('school');
            model._pk = 'schoolID';
            var data;
            if (schoolname == '') {
                data = yield model.page(page, size).countSelect();
            } else {
                data = yield model.where({ schoolName: ['like', `%${schoolname}%`] }).page(page, size).countSelect();
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

    detailAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('id');
            const model = _this2.model('school');
            // model._pk = 'schoolID';

            const data = yield model.where({ schoolID: id }).find();

            const arrdata = [];
            if (!think.isEmpty(data)) {
                // for (const item of data.data) {
                data.scenery = yield _this2.model('school').getScenerybyid(data.schoolID);
                data.discussList = yield _this2.model('discuss').getDiscussById(id, 2);
                //     // item.shstate = await this.model('school').getstate(item.schoolID);
                //     arrdata.push(item);
                // }
                // data.data = arrdata;
            }
            return _this2.success(data);
        })();
    }

    deleteAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            const data = {
                shstate: 1
            };
            yield _this3.model('school').where({ schoolID: id }).update(data);
            return _this3.success('学校删除成功');
        })();
    }

    addEditAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const schoolname = _this4.post('schoolname');
            const province = _this4.post('province') || '';
            const city = _this4.post('city') || '';
            const address = _this4.post('address') || '';
            const schooldesc = _this4.post('schooldesc');
            const longitude = _this4.post('longitude');
            const latitude = _this4.post('latitude');
            const soundurl = _this4.post('soundurl');
            const videourl = _this4.post('videourl');
            const areaid = _this4.post('areaid');
            const parentid = _this4.post('parentid') || 0;
            const id = _this4.get('id');

            let param = {
                schoolName: schoolname,
                province: province,
                city: city,
                address: address,
                schooldesc: schooldesc,
                longitude: longitude,
                latitude: latitude,
                soundurl,
                videourl, areaid, parentid
            };
            if (think.isEmpty(id)) {
                let model = _this4.model('school');
                const insertid = yield model.add(param);

                // 上传学校图片
                if (insertid) {
                    // const sourceaddress = this.post('sourceaddress');
                    // const insertid2 = await this.model('source').add({
                    //     sourceType:0,
                    //     sourceAddress: sourceaddress,
                    //     targetid: insertid
                    // });

                    return _this4.json({
                        insertid: insertid
                    });
                }
            } else {
                // 1 删除source, 2修改
                yield _this4.model('source').where({ targetid: id }).delete();
                yield _this4.model('school').where({ schoolID: id }).update(param);
                return _this4.success('学校修改成功');
            }
        })();
    }
};
//# sourceMappingURL=school.js.map