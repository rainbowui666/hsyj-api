function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    getMyallAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const id = _this.get('studentid');
            const shstate = _this.get('shstate');
            const data = yield _this.model('student_activity').query("select count(studentID) as attentionActivityTimes,(select count(studentID) as attentions from culture_student_activity where studentid=" + id + " and shstate=" + shstate + ") attentionSceneryTimes, (select count(studentid) as attent from culture_discuss where studentid=" + id + ") attentionDiscuss from culture_student_scenery where studentid=" + id + " and shstate=" + shstate + "");
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
                item.shstate = yield _this2.model('scenery').getstate(item.sceneryid);
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
            const hasjoin = _this3.get('hasjoin');

            const start = (pageindex - 1) * pagesize;
            const model = _this3.model('student');
            model._pk = "studentID";
            let data = null;
            let counta = null;

            if (think.isEmpty(hasjoin)) {
                data = yield model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已经报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " limit " + start + "," + pagesize + "");
                counta = yield model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " ) t");
            } else if (hasjoin == '进行中') {
                data = yield model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已经报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " and (a.endDate > now() and now() > a.startDate) limit " + start + "," + pagesize + "");
                counta = yield model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " and (a.endDate > now() and now() > a.startDate)) t");
            } else if (hasjoin == '已完成') {
                data = yield model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已经报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " and a.endDate < now() limit " + start + "," + pagesize + "");
                counta = yield model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " and a.endDate < now()) t");
            } else if (hasjoin == '已报名') {
                data = yield model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已经报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " and a.startDate > now() limit " + start + "," + pagesize + "");
                counta = yield model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " and a.startDate > now()) t");
            } else {
                data = yield model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已经报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " limit " + start + "," + pagesize + "");
                counta = yield model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid=" + id + " ) t");
            }
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this3.model('activity').getPicsbyid(item.activityid);
                // let joindate = await this.model('student_activity').getStudentIsJoinActivity(id,item.activityid);
                // if (Number(new Date()) > Number(new Date(item.endDate)) && joindate && joindate.length > 0) {
                //     item.hasjoin = '已完成'
                // } else if(joindate && joindate.length > 0) {
                //     item.hasjoin = '已报名' 
                // } else if (Number(new Date(item.startDate)) < Number(new Date()) < Number(new Date(item.endDate))) {
                //     item.hasjoin = '进行中';
                // }
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this3.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }

    getMyDiscussAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this4.get('studentid');
            const pageindex = _this4.get('pageindex') || 1;
            const pagesize = _this4.get('pagesize') || 5;

            const model = _this4.model('discuss');
            model._pk = "discussID";
            const data = yield model.where({ studentid: studentid, shstate: 1 }).order('discussID desc').page(pageindex, pagesize).countSelect();
            return _this4.success(data);
        })();
    }

    getMySceneryAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const studentid = _this5.get('studentid');
            const model = _this5.model('student_scenery');
            let data = null;
            if (!think.isEmpty(studentid)) {
                data = yield model.query("select ss.*,s.sceneryTitle,s.shdesc,s.sctype from culture_student_scenery ss left join culture_scenery s on ss.sceneryid=s.sceneryid where s.shstate=0 and ss.studentid=" + studentid + " and ss.shstate=1");
            } else {
                data = yield model.query("select ss.*,s.sceneryTitle,s.shdesc,s.sctype from culture_student_scenery ss left join culture_scenery s on ss.sceneryid=s.sceneryid where s.shstate=0 and ss.shstate=1");
            }
            const arrdata = [];
            for (const item of data) {
                item.pics = yield _this5.model('scenery').getPicsbyid(item.sceneryid);
                item.shstate = yield _this5.model('scenery').getstate(item.sceneryid);
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this5.success(data);
        })();
    }
};
//# sourceMappingURL=myself.js.map