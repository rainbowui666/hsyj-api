const Base = require('./base.js');

module.exports = class extends Base {
    async searchListAction() {
        const scenerymodel = this.model('scenery');
        scenerymodel._pk = 'sceneryID'
        const keyword = this.get('keyword') || '';
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const start = (pageindex -1) * pagesize;

        // const data = await scenerymodel.field(['sceneryid as id', 'scenerytitle as title', "'scenery' as msgtype", 'longitude','latitude']).where({scenerytitle: ['like', `%${keyword}%`]})
        // .union("select schoolid as id,schoolname as title, 'school' as msgtype,longitude,latitude from culture_school where schoolname like '%"+keyword+"%'")
        // .page(pageindex, pagesize).countSelect()
        var data = await scenerymodel.query("Select * from (select sceneryid as id,scenerytitle as title, 'scenery' as msgtype,longitude,latitude,address from culture_scenery where scenerytitle like '%"+keyword+"%' UNION all select schoolid as id,schoolname as title, 'school' as msgtype,longitude,latitude,address from culture_school where schoolname like '%"+keyword+"%' and parentid!=0) as aa where id order by id desc limit "+start+","+pagesize+"");
        var counta = await scenerymodel.query("select count(*) t from (Select * from (select sceneryid as id,scenerytitle as title, 'scenery' as msgtype,longitude,latitude from culture_scenery where scenerytitle like '%"+keyword+"%' UNION all select schoolid as id,schoolname as title, 'school' as msgtype,longitude,latitude from culture_school where schoolname like '%"+keyword+"%' and parentid!=0) as aa ) t ");
        const pagecount = Math.ceil(counta[0].t / pagesize);
        
        const arrdata = [];
        for (const item of data) {
            if (item.msgtype == 'scenery') {
                item.pics = await this.model('scenery').getPicsbyid(item.id);
                item.shstate = await this.model('scenery').getstate(item.id);
            } else {
                item.pics = await this.model('school').getPicsbyid(item.id);
                item.shstate = await this.model('school').getstate(item.id);
            }
            arrdata.push(item)
        }
        data.data = arrdata;
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
    }
} 