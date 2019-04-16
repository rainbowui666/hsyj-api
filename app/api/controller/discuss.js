function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    addAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const distype = _this.get('distype');
            const targetid = _this.get('targetid') || 0;
            const studentid = _this.get('studentid');
            const content = _this.post('content');
            const shstate = _this.post('shstate') || 0;

            const model = _this.model('discuss');
            let data = {
                distype, targetid, studentid, content, shstate
            };

            let insertid = yield model.add(data);
            return _this.success('留言成功');
        })();
    }

    listAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const model = _this2.model('discuss');
            const pageindex = _this2.get('pageindex') || 1;
            const pagesize = _this2.get('pagesize') || 5;
            const shstate = _this2.get('shstate');
            const distype = _this2.get('distype');
            const sceneryid = _this2.get('sceneryid');
            const activityID = _this2.get('activityid');
            const schoolid = _this2.get('schoolid');

            let typeconition = '';
            let scenerycondition = '';
            let activitycondition = '';
            let schoolcondition = '';
            let statusconditionn = '';

            if (think.isEmpty(shstate)) {
                statusconditionn = '1=1 ';
            } else {
                statusconditionn = 'a.shstate=' + shstate;
            }

            if (think.isEmpty(distype)) {
                typeconition = '1=1 ';
            } else {
                typeconition = 'a.distype=' + distype;
            }

            if (think.isEmpty(sceneryid)) {
                scenerycondition = '1=1 ';
            } else {
                scenerycondition = 'sceneryid=' + sceneryid;
            }

            if (think.isEmpty(activityID)) {
                activitycondition = '1=1 ';
            } else {
                activitycondition = 'activityID=' + activityID;
            }

            if (think.isEmpty(schoolid)) {
                schoolcondition = '1=1 ';
            } else {
                schoolcondition = 'schoolID=' + schoolid;
            }

            const start = (pageindex - 1) * pagesize;
            const data = yield model.query("select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where " + scenerycondition + " limit 1) when distype=1 then (select activityname from culture_activity where " + activitycondition + " limit 1) when distype=2 then (select schoolname from culture_school where " + schoolcondition + " limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where " + typeconition + " and " + statusconditionn + " and a.discussid order by discussID desc limit " + start + "," + pagesize + " ");
            const counta = yield model.query("select count(*) t from (select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where " + scenerycondition + " limit 1) when distype=1 then (select activityname from culture_activity where " + activitycondition + " limit 1) when distype=2 then (select schoolname from culture_school where " + schoolcondition + " limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where " + typeconition + " and " + statusconditionn + " ) t ");
            const pagecount = Math.ceil(counta[0].t / pagesize); //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
            return _this2.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }

    updateAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('id');
            const shstate = _this3.get('shstate');
            const data = {
                shstate
            };

            yield _this3.model('discuss').where({ discussID: id }).update(data);
            return _this3.success('修改成功');
        })();
    }
};
//# sourceMappingURL=discuss.js.map