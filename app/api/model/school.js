function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');

module.exports = class extends think.Model {
    getPicsbyid(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const data = yield _this.model('source').where({ sourceType: 0, targetid: id }).select();
            return data;
        })();
    }

    getScenerybyid(id) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const model = _this2.model('scenery');
            model._pk = 'sceneryID';
            const data = yield model.where({ schoolid: id, shstate: 0 }).select();

            const arrdata = [];
            for (const item of data) {
                // item.pics = item
                item.pics = yield _this2.getPicsbyid(item.sceneryID);
                item.shstate = yield _this2.getstate(item.schoolid);
                arrdata.push(item);
            }
            data.data = arrdata;
            return data;
        })();
    }

    getstate(id) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const model = _this3.model('student_school');
            model._pk = 'schoolid';
            const checkin = yield model.where({ schoolid: id, shstate: 1 }).count('schoolid');
            const wantto = yield model.where({ schoolid: id, shstate: 0 }).count('schoolid');
            const sharenum = yield model.where({ schoolid: id, shstate: 4 }).count('schoolid');

            const modeldis = _this3.model('discuss');
            modeldis._pk = 'discussID';
            const disnum = yield modeldis.where({ distype: 2, targetid: id, shstate: 1 }).count('discussID');
            return {
                checkin: checkin,
                wantto: wantto,
                sharenum: sharenum,
                disnum: disnum
            };
        })();
    }
};
//# sourceMappingURL=school.js.map