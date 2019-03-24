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
            const checkin = yield model.where({ sceneryid: id, shstate: 1 }).count('sceneryid');
            const wantto = yield model.where({ sceneryid: id, shstate: 0 }).count('sceneryid');
            const sharenum = yield model.where({ sceneryid: id, shstate: 4 }).count('sceneryid');

            const modeldis = _this2.model('discuss');
            modeldis._pk = 'discussID';
            const disnum = yield modeldis.where({ distype: 0, targetid: id, shstate: 1 }).count('discussID');
            return {
                checkin: checkin,
                wantto: wantto,
                sharenum: sharenum,
                disnum: disnum
            };
        })();
    }
};
//# sourceMappingURL=scenery.js.map