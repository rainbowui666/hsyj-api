function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
    searchListAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const scenerymodel = _this.model('scenery');
            scenerymodel._pk = 'sceneryID';
            const keyword = _this.get('keyword') || '';
            const pageindex = _this.get('pageindex') || 1;
            const pagesize = _this.get('pagesize') || 5;
            const start = (pageindex - 1) * pagesize;

            // const data = await scenerymodel.field(['sceneryid as id', 'scenerytitle as title', "'scenery' as msgtype", 'longitude','latitude']).where({scenerytitle: ['like', `%${keyword}%`]})
            // .union("select schoolid as id,schoolname as title, 'school' as msgtype,longitude,latitude from culture_school where schoolname like '%"+keyword+"%'")
            // .page(pageindex, pagesize).countSelect()
            var data = yield scenerymodel.query("Select * from (select sceneryid as id,scenerytitle as title, 'scenery' as msgtype,longitude,latitude,address from culture_scenery where scenerytitle like '%" + keyword + "%' UNION all select schoolid as id,schoolname as title, 'school' as msgtype,longitude,latitude,address from culture_school where schoolname like '%" + keyword + "%') as aa where id order by id desc limit " + start + "," + pagesize + "");
            var counta = yield scenerymodel.query("select count(*) t from (Select * from (select sceneryid as id,scenerytitle as title, 'scenery' as msgtype,longitude,latitude from culture_scenery where scenerytitle like '%" + keyword + "%' UNION all select schoolid as id,schoolname as title, 'school' as msgtype,longitude,latitude from culture_school where schoolname like '%" + keyword + "%') as aa ) t ");
            const pagecount = Math.ceil(counta[0].t / pagesize);

            const arrdata = [];
            for (const item of data) {
                if (item.msgtype == 'scenery') {
                    item.pics = yield _this.model('scenery').getPicsbyid(item.id);
                    item.shstate = yield _this.model('scenery').getstate(item.id);
                } else {
                    item.pics = yield _this.model('school').getPicsbyid(item.id);
                    item.shstate = yield _this.model('school').getstate(item.id);
                }
                arrdata.push(item);
            }
            data.data = arrdata;
            return _this.success({ counta: counta[0].t, pagecount: pagecount, pageindex: pageindex, pagesize: pagesize, data });
        })();
    }
};
//# sourceMappingURL=search.js.map