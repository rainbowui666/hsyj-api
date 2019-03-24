function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    indexAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const page = _this.get('page') || 1;
            const size = _this.get('size') || 10;
            const scenerytitle = _this.get('scenerytitle') || '';

            const model = _this.model('scenery');
            model._pk = 'sceneryID';

            var data;
            if (scenerytitle == '') {
                data = yield model.page(page, size).countSelect();
            } else {
                data = yield model.where({ sceneryTitle: ['like', `%${scenerytitle}%`] }).page(page, size).countSelect();
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

    deleteAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('id');
            const data = {
                shstate: 1
            };
            yield _this2.model('scenery').where({ sceneryID: id }).update(data);
            return _this2.success('删除成功');
        })();
    }

    detailAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            const model = _this3.model('scenery');
            const data = yield model.where({ schoolID: id }).find();

            const arrdata = [];
            // for (const item of data.data) {
            data.scenery = yield _this3.model('school').getScenerybyid(data.schoolID);
            //     // item.shstate = await this.model('school').getstate(item.schoolID);
            //     arrdata.push(item);
            // }
            // data.data = arrdata;
            return _this3.success(data);
        })();
    }

    addEditAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const sceneryTitle = _this4.post('scenerytitle');
            const schoolid = _this4.post('schoolid');
            const address = _this4.post('address') || '';
            const shdesc = _this4.post('shdesc');
            const longitude = _this4.post('longitude');
            const latitude = _this4.post('latitude');
            const soundurl = _this4.post('soundurl');
            const videourl = _this4.post('videourl');
            const id = _this4.get('id');

            let param = {
                sceneryTitle: sceneryTitle,
                schoolid: schoolid,
                address: address,
                shdesc: shdesc,
                longitude: longitude,
                latitude: latitude,
                soundurl,
                videourl
            };
            if (think.isEmpty(id)) {
                let model = _this4.model('scenery');
                const insertid = yield model.add(param);

                // 上传景点图片
                if (insertid) {
                    return _this4.json({
                        insertid: insertid
                    });
                }
            } else {
                // 1 删除source, 2修改
                yield _this4.model('source').where({ targetid: id }).delete();
                yield _this4.model('scenery').where({ sceneryID: id }).update(param);
                return _this4.success('景点修改成功');
            }
        })();
    }
};
//# sourceMappingURL=scenery.js.map