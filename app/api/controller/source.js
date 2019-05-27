function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {

    getListBytargetidAndSourceTypeAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const targetid = _this.get('targetid');
            const sourcetype = _this.get('sourcetype');
            const pageindex = _this.get('pageindex') || 1;
            const pagesize = _this.get('pagesize') || 10;

            const model = _this.model('source');
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
            return _this.success(data);
        })();
    }
};