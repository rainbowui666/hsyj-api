function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    getMyallAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.get('studentid');
            const shstate = _this.get('shstate');
            const data = yield _this.model('student_activity').query("select count(studentID) as attentionActivityTimes,(select count(studentID) as attentions from culture_student_activity where studentid=" + id + " and shstate=" + shstate + ") attentionSceneryTimes from culture_student_scenery where studentid=" + id + " and shstate=" + shstate + "");
            return _this.success(data);
        })();
    }

    getMyAttentionAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const id = _this2.get('studentid');
            const pageindex = _this2.get('pageindex') || 1;
            const pagesize = _this2.get('pagesize') || 5;
            const start = (pageindex - 1) * pagesize;
            const model = _this2.model('student');
            model._pk = "studentID";

            const data = yield model.query("select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid=" + id + " limit " + start + "," + pagesize + "");
            const counta = yield model.query("select count(*) t from (select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid=" + id + " ) t");
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this2.model('scenery').getPicsbyid(item.sceneryid);
                arrdata.push(item);
            }
            data.data = arrdata;

            return _this2.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }

    getMyActivityListAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const id = _this3.get('studentid');
            const pageindex = _this3.get('pageindex') || 1;
            const pagesize = _this3.get('pagesize') || 5;
            const start = (pageindex - 1) * pagesize;
            const model = _this3.model('student');
            model._pk = "studentID";
            const data = yield model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " limit " + start + "," + pagesize + "");
            const counta = yield model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " ) t");
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this3.model('activity').getPicsbyid(item.activityid);
                let joindate = yield _this3.model('student_activity').getStudentIsJoinActivity(id, item.activityid);
                if (Number(new Date()) > Number(new Date(item.endDate)) && joindate && joindate.length > 0) {
                    item.hasjoin = '已完成';
                } else if (item.hasjoin = joindate && joindate.length > 0) {
                    item.hasjoin = '已报名';
                } else {
                    item.hasjoin = '';
                }
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this3.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }
};
//# sourceMappingURL=myself.js.map