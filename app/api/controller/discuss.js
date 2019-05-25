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
            const studentid = _this2.get('studentid');

            let typeconition = '';
            let scenerycondition = '';
            let activitycondition = '';
            let schoolcondition = '';
            let statusconditionn = '';
            let studentcondition = '';

            if (think.isEmpty(shstate)) {
                statusconditionn = '1=1 ';
            } else {
                statusconditionn = 'a.shstate=' + shstate;
            }

            if (think.isEmpty(distype)) {
                typeconition = '1=1 ';
            } else {
                let id = -1;
                if (distype == 0) {
                    id = sceneryid;
                } else if (distype == 1) {
                    id = activityID;
                } else if (distype == 2) {
                    id = schoolid;
                } else if (distype == 3) {
                    id = 0;
                }
                if (!think.isEmpty(id)) {
                    typeconition = 'a.distype=' + distype + ' and a.targetid=' + id;
                } else {
                    typeconition = 'a.distype=' + distype;
                }
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

            if (think.isEmpty(studentid)) {
                studentcondition = '1=1 ';
            } else {
                studentcondition = 'a.studentid=' + studentid;
            }
            const start = (pageindex - 1) * pagesize;
            const data = yield model.query("select a.discussID,s.studentName,s.photo,a.distype,a.targetid,a.studentid,a.content,a.shstate,a.isrecommend,a.createdate, case  when distype=0 then (select scenerytitle from culture_scenery where " + scenerycondition + " limit 1) when distype=1 then (select activityname from culture_activity where " + activitycondition + " limit 1) when distype=2 then (select schoolname from culture_school where " + schoolcondition + " limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where " + typeconition + " and " + studentcondition + " and " + statusconditionn + "  order by discussID desc limit " + start + "," + pagesize + " ");
            const counta = yield model.query("select count(*) t from (select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where " + scenerycondition + " limit 1) when distype=1 then (select activityname from culture_activity where " + activitycondition + " limit 1) when distype=2 then (select schoolname from culture_school where " + schoolcondition + " limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where " + typeconition + " and " + studentcondition + " and " + statusconditionn + " ) t ");
            const pagecount = Math.ceil(counta[0].t / pagesize); //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
            return _this2.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }

    homeDiscussAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const model = _this3.model('discuss');
            model._pk = "discussID";
            const pageindex = _this3.get('pageindex') || 1;
            const pagesize = _this3.get('pagesize') || 5;
            const studentid = _this3.get('studentid');

            const homedata = yield _this3.cache('home_discuss' + pageindex + '_' + pagesize);
            if (!think.isEmpty(homedata)) {
                console.log('read from cache');
                return _this3.success(homedata);
            }
            const data = yield model.where({ shstate: 1, isrecommend: 1 }).order('discussID desc').page(pageindex, pagesize).countSelect();

            const arrdata = [];
            for (const item of data.data) {
                if (item.distype == 0) {
                    // 景点
                    item.pics = yield _this3.model('scenery').getPicsbyid(item.targetid);
                } else if (item.distype == 1) {
                    // 活动
                    item.pics = yield _this3.model('activity').getPicsbyid(item.targetid);
                    item.isgroup = yield _this3.model('activity').where({ activityID: item.targetid }).getField('isGroup', true);
                } else if (item.distype == 2) {
                    item.pics = yield _this3.model('school').getPicsbyid(item.targetid);
                } else {
                    item.pics = [];
                }
                item.likednum = yield _this3.model('like_discuss').where({ discussid: item.discussID, studentid: studentid }).count();
                item.poto = yield _this3.model('student').field(['photo', 'studentName']).where({ studentID: item.studentid }).find();
                arrdata.push(item);
            }
            data.data = arrdata;
            // console.log('set cache')
            // await this.cache('home_discuss'+pageindex+'_'+pagesize, data, 'redis')

            // await this.model('pagecache').add({cachename:'home_discuss'+pageindex+'_'+pagesize});

            return _this3.success(data);
        })();
    }

    likediscussAction() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const id = _this4.get('discussid');
            const studentid = _this4.get('studentid');
            let data = yield _this4.model('discuss').where({ discussID: id }).find();
            let clicknum = data.clicknum + 1;
            const para = { clicknum: clicknum };
            yield _this4.model('discuss').where({ discussID: id }).update(para);
            yield _this4.model('like_discuss').add({ studentid: studentid, discussid: id });
            return _this4.success('点赞成功');
        })();
    }

    hasLikeDiscussAction() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const id = _this5.get('discussid');
            const studentid = _this5.get('studentid');
            const data = yield _this5.model('like_discuss').where({ discussid: id, studentid: studentid }).count();
            return _this5.success(data);
        })();
    }

};
//# sourceMappingURL=discuss.js.map