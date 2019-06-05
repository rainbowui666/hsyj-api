const Base = require('./base.js');

module.exports = class extends Base {
    async listAction() {
        const model =  this.model('discuss');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const shstate = this.get('shstate');
        const distype = this.get('distype');
        const sceneryid = this.get('sceneryid');
        const activityID = this.get('activityid');
        const schoolid = this.get('schoolid');
        const studentid = this.get('studentid');

        let typeconition = '';
        let scenerycondition = '';
        let activitycondition = '';
        let schoolcondition = '';
        let statusconditionn = '';
        let studentcondition = '';

        let userinfo = await this.cache('userinfo');
        if (think.isEmpty(userinfo)) {
            return this.field('请先登录')
        }

        if (think.isEmpty(shstate)) {
            statusconditionn = '1=1 ';
        } else {
            statusconditionn = 'a.shstate='+shstate
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
            if(!think.isEmpty(id)) {
                typeconition = 'a.distype='+distype+' and a.targetid='+id;
            } else {
                typeconition = 'a.distype='+distype;
            }
        }

        if (think.isEmpty(sceneryid)) {
            scenerycondition = '1=1 ';
        } else {
            scenerycondition = 'sceneryid='+sceneryid
        }

        if (think.isEmpty(activityID)) {
            activitycondition = '1=1 ';
        } else {
            activitycondition = 'activityID='+activityID;
        }

        if (think.isEmpty(schoolid)) {
            schoolcondition = '1=1 ';
        } else {
            schoolcondition = 'schoolID='+schoolid;
        }

        if (think.isEmpty(studentid)) {
            studentcondition = '1=1 ';
        } else {
            studentcondition = 'a.studentid='+studentid;
        }
        const start = (pageindex -1) * pagesize;
        let data,counta;
        if (userinfo[0].usertype == 1) { // 管理员
            data = await model.query("select a.discussID,s.studentName,s.photo,s.schoolid,a.distype,a.targetid,a.studentid,a.content,a.shstate,a.isrecommend,a.createdate, case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+" limit 1) when distype=1 then (select activityname from culture_activity where "+activitycondition+" limit 1) when distype=2 then (select schoolname from culture_school where "+schoolcondition+" limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+studentcondition+" and "+statusconditionn+"  order by discussID desc limit "+start+","+pagesize+" ");
            counta = await model.query("select count(*) t from (select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+" limit 1) when distype=1 then (select activityname from culture_activity where "+activitycondition+" limit 1) when distype=2 then (select schoolname from culture_school where "+schoolcondition+" limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+studentcondition+" and "+statusconditionn+" ) t ");
        } else {
            data = await model.query("select a.discussID,s.studentName,s.photo,s.schoolid,a.distype,a.targetid,a.studentid,a.content,a.shstate,a.isrecommend,a.createdate, case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+" limit 1) when distype=1 then (select activityname from culture_activity where "+activitycondition+" limit 1) when distype=2 then (select schoolname from culture_school where "+schoolcondition+" limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+studentcondition+" and "+statusconditionn+" and s.schoolid="+userinfo[0].schoolid+" order by discussID desc limit "+start+","+pagesize+" ");
            counta = await model.query("select count(*) t from (select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+" limit 1) when distype=1 then (select activityname from culture_activity where "+activitycondition+" limit 1) when distype=2 then (select schoolname from culture_school where "+schoolcondition+" limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+studentcondition+" and "+statusconditionn+" and s.schoolid="+userinfo[0].schoolid+") t ");
        }
        const pagecount = Math.ceil(counta[0].t / pagesize); //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
    }

    async updateAction() {
        const id = this.get('id');
        const shstate = this.get('shstate');
        const isrecommend = this.get('isrecommend') || 0;
        const data = {
            shstate,isrecommend
        }

        // 查找缓存
        await this.model('pagecache').getdatabyname('home_discuss');

        await this.model('discuss').where({discussID:id}).update(data);
        return this.success('修改成功')
    }
}