const Base = require('./base.js');

module.exports = class extends Base {
    async addAction() {
        const distype = this.get('distype');
        const targetid = this.get('targetid') || 0;
        const studentid = this.get('studentid');
        const content = this.post('content');
        const shstate = this.post('shstate') || 0;   

        const model = this.model('discuss');
        let data = {
            distype,targetid,studentid,content,shstate
        }

        let insertid = await model.add(data);
        return this.success('留言成功')
    }

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
        const data = await model.query("select a.discussID,s.studentName,s.photo,a.distype,a.targetid,a.studentid,a.content,a.shstate,a.isrecommend,a.createdate, case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+" limit 1) when distype=1 then (select activityname from culture_activity where "+activitycondition+" limit 1) when distype=2 then (select schoolname from culture_school where "+schoolcondition+" limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+studentcondition+" and "+statusconditionn+"  order by discussID desc limit "+start+","+pagesize+" ");
        const counta = await model.query("select count(*) t from (select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+" limit 1) when distype=1 then (select activityname from culture_activity where "+activitycondition+" limit 1) when distype=2 then (select schoolname from culture_school where "+schoolcondition+" limit 1) when distype=3 then \"APP首页\" end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+studentcondition+" and "+statusconditionn+" ) t ");
        const pagecount = Math.ceil(counta[0].t / pagesize); //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
    }

    async homeDiscussAction() {
        const model =  this.model('discuss');
        model._pk = "discussID";
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const studentid = this.get('studentid');

        const homedata = await this.cache('home_discuss'+pageindex+'_'+pagesize);
        if (!think.isEmpty(homedata)) {
            console.log('read from cache')
            return this.success(homedata)
        }
        const data = await model.where({shstate:1, isrecommend:1}).order('discussID desc').page(pageindex, pagesize).countSelect();

        const arrdata = [];
        for (const item of data.data) {
            if (item.distype == 0) { // 景点
                item.pics = await this.model('scenery').getPicsbyid(item.targetid);
            } else if (item.distype == 1) { // 活动
                item.pics = await this.model('activity').getPicsbyid(item.targetid);
                item.isgroup = await this.model('activity').where({activityID:item.targetid}).getField('isGroup', true);
            } else if (item.distype == 2) {
                item.pics = await this.model('school').getPicsbyid(item.targetid);
            } else {
                item.pics = []
            }
            item.likednum = await this.model('like_discuss').where({discussid:item.discussID, studentid:studentid}).count();
            item.poto = await this.model('student').field(['photo','studentName']).where({studentID:item.studentid}).find();
            arrdata.push(item)
        }
        data.data = arrdata;
        // console.log('set cache')
        // await this.cache('home_discuss'+pageindex+'_'+pagesize, data, 'redis')

        // await this.model('pagecache').add({cachename:'home_discuss'+pageindex+'_'+pagesize});

        return this.success(data)
    }

    async likediscussAction() {
        const id = this.get('discussid');
        const studentid = this.get('studentid');
        let data = await this.model('discuss').where({discussID:id}).find();
        let clicknum = data.clicknum + 1;
        const para = {clicknum:clicknum};
        await this.model('discuss').where({discussID:id}).update(para);
        await this.model('like_discuss').add({studentid: studentid, discussid:id});
        return this.success('点赞成功');
    }

    async hasLikeDiscussAction() {
        const id = this.get('discussid');
        const studentid = this.get('studentid');
        const data = await this.model('like_discuss').where({discussid:id, studentid:studentid}).count();
        return this.success(data)
    }
    
}