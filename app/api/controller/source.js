function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const sourcetype = _this.post('sourcetype');
            const insertid = _this.post('insertid');
            const sourceaddress = _this.post('sourceaddress');

            const insertid2 = yield _this.model('source').add({
                sourceType: sourcetype,
                sourceAddress: sourceaddress,
                targetid: insertid
            });

            if (insertid2) {
                return _this.success('学校添加成功');
            }
        })();
    }

    deleteAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('sourceid');
            const date = yield _this2.model('source').where({ sourceID: id }).delete();
            return _this2.success('删除成功');
        })();
    }

    getListBytargetidAndSourceTypeAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const targetid = _this3.get('targetid');
            const sourcetype = _this3.get('sourcetype');
            const pageindex = _this3.get('pageindex') || 1;
            const pagesize = _this3.get('pagesize') || 10;

            const model = _this3.model('source');
            model._pk = 'sourceID';

            let para = {};
            if (!think.isEmpty(targetid) && !think.isEmpty(sourcetype)) {
                para = { targetid: targetid, sourceType: sourcetype };
            } else if (!think.isEmpty(targetid)) {
                para = { targetid: targetid };
            } else {
                para = { sourceType: sourcetype };
            }
            const data = yield model.where(para).page(pageindex, pagesize).countSelect();
            return _this3.success(data);
        })();
    }
};
//# sourceMappingURL=source.js.map