const Base = require('./base.js');

module.exports = class extends Base {
    async getMyallAction() {
        const id = this.get('studentid');
        const shstate = this.get('shstate');
        const data = await this.model('student_activity').query("select count(studentID) as attentionActivityTimes,(select count(studentID) as attentions from culture_student_activity where studentid="+id+" and shstate="+shstate+") attentionSceneryTimes, (select count(studentid) as attent from culture_discuss where studentid="+id+") attentionDiscuss from culture_student_scenery where studentid="+id+" and shstate="+shstate+"")
        return this.success(data)
    }

    async getMyAttentionAction() {
        const id = this.get('studentid');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const start = (pageindex -1) * pagesize;
        const model =  this.model('student');
        model._pk = "studentID";

        const data = await model.query("select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid="+id+" limit "+start+","+pagesize+"");
        const counta = await model.query("select count(*) t from (select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid="+id+" ) t");
        const pagecount = Math.ceil(counta[0].t / pagesize);

        const arrdata = [];
        for (const item of data) {
            item.pics = await this.model('scenery').getPicsbyid(item.sceneryid);
            item.shstate = await this.model('scenery').getstate(item.sceneryid);
            arrdata.push(item);
        }
        data.data = arrdata;

        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
    }

    async getMyActivityListAction() {
        const id = this.get('studentid');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const hasjoin = this.get('hasjoin');

        const start = (pageindex -1) * pagesize;
        const model =  this.model('student');
        model._pk = "studentID";
        let data = null;
        let counta = null;

        if (think.isEmpty(hasjoin)) {
            data = await model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" limit "+start+","+pagesize+"");
            counta = await model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" ) t");
        } else if (hasjoin == '进行中'){
            data = await model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" and (a.endDate > now() and now() > a.startDate) limit "+start+","+pagesize+"");
            counta = await model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" and (a.endDate > now() and now() > a.startDate)) t");
        } else if (hasjoin == '已完成') {
            data = await model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" and a.endDate < now() limit "+start+","+pagesize+"");
            counta = await model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" and a.endDate < now()) t");      
        } else if (hasjoin == '已报名') {
            data = await model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" and a.startDate > now() limit "+start+","+pagesize+"");
            counta = await model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" and a.startDate > now()) t");      
        } else {
            data = await model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate,case when (a.endDate > now() and now() > a.startDate) then '进行中' when a.endDate < now() then '已完成' when a.startDate > now() then '已报名' end as hasjoin from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" limit "+start+","+pagesize+"");
            counta = await model.query("select count(*) t from (select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" ) t");
        }
        const pagecount = Math.ceil(counta[0].t / pagesize);

        const arrdata = [];
        for (const item of data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityid);
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
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
    }

    async getMyDiscussAction() {
        const studentid = this.get('studentid');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;

        const model = this.model('discuss')
        model._pk="discussID";
        const data = await model.where({studentid: studentid, shstate:1}).order('discussID desc').page(pageindex, pagesize).countSelect();
        return this.success(data)
    }

    async getMySceneryAction() {
        const studentid = this.get('studentid');
        const model = this.model('student_scenery');
        let data = null;
        if (!think.isEmpty(studentid)) {
            data = await model.query("select ss.*,s.sceneryTitle,s.shdesc,s.sctype from culture_student_scenery ss left join culture_scenery s on ss.sceneryid=s.sceneryid where s.shstate=0 and ss.studentid="+studentid+" and ss.shstate=1 and ss.sceneryid not in (select targetid from culture_discuss where distype=0 and studentid="+studentid+")");
        } else {
            data = await model.query("select ss.*,s.sceneryTitle,s.shdesc,s.sctype from culture_student_scenery ss left join culture_scenery s on ss.sceneryid=s.sceneryid where s.shstate=0 and ss.shstate=1 and ss.sceneryid not in (select targetid from culture_discuss where distype=0)");
        }
            const arrdata = [];
        for (const item of data) {
            item.pics = await this.model('scenery').getPicsbyid(item.sceneryid);
            item.shstate = await this.model('scenery').getstate(item.sceneryid);
            arrdata.push(item);
        }
        data.data = arrdata;
        return this.success(data);
    }
}