function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');

module.exports = class extends think.Model {
    getDiscussById(id, distype) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const model = _this.model('discuss');
            model._pk = 'discussID';
            const data = yield model.where({ distype: distype, targetid: id, shstate: 1 }).select();
            return data;
        })();
    }
};
//# sourceMappingURL=discuss.js.map