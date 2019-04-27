const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
    async frontListAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const endDate = new Date();
        const date = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+' 00:00:00'
        const data = await model.where({shstate: 0, endDate:{'>': date}}).page(page,size).countSelect();

        const arrdata = [];

        for (const item of data.data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityID);
            // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))
            if (Number(new Date(item.startDate)) <= Number(new Date()) <= Number(new Date(item.endDate))) {
                item.status='进行中';
            } else {
                item.status = '';
            }
            let joindate = await this.model('student_activity').getStudentIsJoinActivity(studentid,item.activityID);
            if (Number(new Date()) > Number(new Date(item.endDate)) && joindate && joindate.length > 0) {
                item.hasjoin = '已完成'
            } else if(item.hasjoin = joindate && joindate.length > 0) {
                item.hasjoin = '已报名' 
            } else {
                item.hasjoin = '';
            }
            item.needSchoolRangName = await this.model('school').getSchoolNameByIds(item.needSchoolRang);
            item.shstate = await this.model('activity').getstate(item.activityID);
            arrdata.push(item);
        }
        data.data = arrdata;

        return this.success(data)
    }

    async getactivitydetailAction() {
        const id = this.get('id');
        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const data = await model.where({activityID: id}).find();
        if (!think.isEmpty(data)) {
            data.pics = await this.model('activity').getPicsbyid(data.activityID);
            // data.discussList = await this.model('discuss').getDiscussById(id,1);
            data.shstate = await this.model('activity').getstate(data.activityID);
            let joindate = await this.model('student_activity').getStudentIsJoinActivity(studentid,data.activityID);
            if (Number(new Date()) > Number(new Date(data.endDate)) && joindate && joindate.length > 0) {
                data.hasjoin = '已完成'
            } else if(data.hasjoin = joindate && joindate.length > 0) {
                data.hasjoin = '已报名' 
            } else {
                data.hasjoin = '';
            }
        }
        return this.success(data);
    }

    async getactivitydetailForGroupAction() {
        const id = this.get('id');
        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const data = await model.where({activityID: id}).find();
        if (!think.isEmpty(data)) {
            data.pics = await this.model('activity').getPicsbyid(data.activityID);
            // data.discussList = await this.model('discuss').getDiscussById(id,1);
            data.shstate = await this.model('activity').getstate(data.activityID);
            let joindate = await this.model('student_activity').getStudentIsJoinActivity(studentid,data.activityID);
            if (Number(new Date()) > Number(new Date(data.endDate)) && joindate && joindate.length > 0) {
                data.hasjoin = '已完成'
            } else if(data.hasjoin = joindate && joindate.length > 0) {
                data.hasjoin = '已报名' 
            } else {
                data.hasjoin = '';
            }
            data.group=await this.model('group').where({activityid:data.activityID}).select();
        }
        return this.success(data);
    }

    async getActivityDiscussListAction() {
        const id = this.get('id');
        const model = this.model('activity');
        model._pk = 'activityID';
        const data = await model.where({activityID: id}).find();
        if (!think.isEmpty(data)) {
            data.discussList = await this.model('discuss').getDiscussById(id,1);
            
        }
        return this.success(data);
    }

    async getActivitySceneryListAction() {
        const studentid = this.get('studentid');
        const model =  this.model('activity_scenery');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const activityid = this.get('activityid');
        const idcondition = activityid ? 'a.activityID=' + activityid : '1=1';
        const start = (pageindex -1) * pagesize;
        const data = await model.query("select s.*,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s left join culture_activity a on a.activityID=s.activityid left join culture_scenery sc on s.sceneryid=sc.sceneryID where "+idcondition+" and a.activityID limit "+start+","+pagesize+" ");
        const counta = await model.query("select count(*) t from (select s.*,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s left join culture_activity a on a.activityID=s.activityid left join culture_scenery sc on s.sceneryid=sc.sceneryID where "+idcondition+" ) t");
        const pagecount = Math.ceil(counta[0].t / pagesize);

        const arrdata = [];
        let arrScen = [];
        let arrSchool = []
        for (const item of data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityid);
            item.shstate = await this.model('activity').getstate(item.activityid);
            arrScen.push(item.sceneryid);
            arrSchool.push(item.schoolid)
            // item.question = await this.model('student_activity').studentJoinActivityAndAnswer(studentid,item.activityID,item.questionid)
            arrdata.push(item)
        }
        let complateSceneryNum = await this.model('attention_activity').where({studentid:studentid,activityid:activityid}).count();
        let complateSchoolNum = await this.model('student_school').where({studentid:studentid,shstate:1}).count();
        arrScen = _.uniq(arrScen);
        arrSchool = _.uniq(arrSchool);
        
        data.data = arrdata;
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,totalScenery:arrScen,totalSchool:arrSchool,complateSceneryNum:complateSceneryNum,complateSchoolNum:complateSchoolNum,data})
    }

    async listAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        let userinfo = await this.cache('userinfo');
        console.log('session',userinfo)

        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const endDate = new Date();
        const date = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+' 00:00:00'
        let data = {};
        if (userinfo && userinfo[0].usertype == 0) {
            data = await model.where({shstate: 0, endDate:{'>': date}, createbyuserid: userinfo[0].sysUserID}).page(page,size).countSelect();
        } else {
            data = await model.where({shstate: 0, endDate:{'>': date}}).page(page,size).countSelect();
        }
        
        const arrdata = [];

        for (const item of data.data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityID);
            item.sceneryCount = await this.model('activity_scenery').where({activityid:item.activityID}).count('activityid');
            item.questionCount = 1; //await this.model('question').where({activityid:item.activityID}).count('activityid');
            // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))
        
            item.needSchoolRangName = await this.model('school').getSchoolNameByIds(item.needSchoolRang);
            // item.shstate = await this.model('activity').getstate(item.activityID);
            arrdata.push(item);
        }
        data.data = arrdata;

        return this.success(data)
    }

    async list2Action() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        let userinfo = await this.cache('userinfo');
        const activityid = this.get('activityid');


        const model = this.model('question');
        model._pk = 'questionID';
        let list = [];
        if (userinfo && userinfo[0] && userinfo[0].usertype == 0) {
            console.log('aaa')
            let condition = {};
            if (think.isEmpty(activityid)) {
                condition = {createbyuserid: userinfo[0].sysUserID};
            } else {
                condition = {'s.activityid':activityid,createbyuserid: userinfo[0].sysUserID};
            }
            list = await model.field(['q.questionID','q.questiontitle','q.answera','q.answerb','q.answerc','q.answerd','q.rightanswer',
                's.sceneryid','s.activityid','cs.sceneryTitle','act.startAddress'])
            .alias('q')
            .join({
                table:'activity_scenery',
                join:'left',
                as: 's',
                on: ['q.questionID', 's.questionID']
            })
            .join({
                table:'scenery',
                join: 'left',
                as: 'cs',
                on: ['cs.sceneryid','s.sceneryid']
            })
            .join({
                table:'activity',
                join:'left',
                as: 'act',
                on: ['act.activityID','s.activityid']
            }).order('activityid desc').where(condition).page(page, size).countSelect();
        } else {
            console.log('bbb')
            let condition = {};
            if (think.isEmpty(activityid)) {
                condition = {1: 1};
            } else {
                condition['s.activityid'] = activityid;
            }
            list = await model.field(['q.questionID','q.questiontitle','q.answera','q.answerb','q.answerc','q.answerd','q.rightanswer',
                's.sceneryid','s.activityid','cs.sceneryTitle','act.startAddress'])
            .alias('q')
            .join({
                table:'activity_scenery',
                join:'left',
                as: 's',
                on: ['q.questionID', 's.questionID']
            })
            .join({
                table:'scenery',
                join: 'left',
                as: 'cs',
                on: ['cs.sceneryid','s.sceneryid']
            })
            .join({
                table:'activity',
                join:'left',
                as: 'act',
                on: ['act.activityID','s.activityid']
            }).where(condition).order('activityid desc').page(page, size).countSelect();
        }
        
        return this.success(list)
    }

    async getActivityQuestionDetailAction() {
        const questionid = this.get('questionid');
        const activityid = this.get('activityid');
        const model = this.model('question');
        // model._pk = 'questionID';

        let data =  await model.field(['q.questionID','q.questiontitle','q.answera','q.answerb','q.answerc','q.answerd','q.rightanswer',
        's.sceneryid','s.activityid','cs.sceneryTitle','act.startAddress'])
        .alias('q')
        .join({
            table:'activity_scenery',
            join:'left',
            as: 's',
            on: ['q.questionID', 's.questionID']
        })
        .join({
            table:'scenery',
            join: 'left',
            as: 'cs',
            on: ['cs.sceneryid','s.sceneryid']
        })
        .join({
            table:'activity',
            join:'left',
            as: 'act',
            on: ['act.activityID','s.activityid']
        }).where({'q.questionID': questionid, 's.activityid': activityid}).find();
        return this.success(data)
    }

    
}