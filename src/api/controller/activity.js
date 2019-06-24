const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
    async getSwipeActAction() {
        const model = this.model('activity');
        model._pk = 'activityID';
        const data = await model.field(['activityID', 'activityName']).where({isrecommend:1, shstate:0}).order('activityID desc').limit(0,5).select();
        
        const arrdata = [];
        for (const item of data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityID);
            item.joinnum = await this.model('student_activity').getJoinNum(item.activityID);
            arrdata.push(item);
        }

        return this.success(data)
    }
    async frontListAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const endDate = new Date();
        const date = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+' 00:00:00'
        // endDate:{'>': think.datetime(date,'YYYY-MM-DD')
        const data = await model.where({shstate: 0, iscomplate: 1, endDate:{'>': think.datetime(date,'YYYY-MM-DD')}}).order('activityID desc').page(page,size).countSelect();

        const arrdata = [];

        for (const item of data.data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityID);
            // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))
            // if (Number(new Date(item.startDate)) <= Number(new Date()) <= Number(new Date(item.endDate))) {
            //     item.status='进行中';
            // } else {
            //     item.status = '';
            // }
            if (!think.isEmpty(studentid)) {
                
                // let joindate = await this.model('student_activity').getStudentIsJoinActivity(studentid,item.activityID, 1);
                let joindate = null;
                if (item.isGroup == 0) {
                    joindate = await this.model('student_activity').getStudentIsJoinActivity(studentid,item.activityID, 1);
                } else {
                    joindate = await this.model('student_activity').getStudentIsJoinGroup(studentid,item.activityID, 1);
                }

                let start = Number(new Date(item.startDate));
                let nowd = Number(new Date());
                let end = Number(new Date(item.endDate));

                // if (nowd > end && joindate && joindate.length > 0) {
                //     item.hasjoin = '已完成'
                // } else if (start < nowd && nowd < end) {
                //     item.hasjoin = '进行中';
                // } else if(joindate && joindate.length > 0) {
                //     item.hasjoin = '已报名' 
                // }

                if (joindate) {
                    console.log('joindate---', joindate, start, nowd, end)
                }

                // if (item.isGroup == 0) {
                    if (joindate && joindate.iscomplate) {
                        item.hasjoin = '已完成'
                    } else if (start < nowd && nowd < end && (joindate && joindate.isAttentention)) {
                        item.hasjoin = '已报名,进行中';
                    } else if (start < nowd && nowd < end) {
                        item.hasjoin = '进行中';
                    } else if(joindate && joindate.isAttentention) {
                        item.hasjoin = '已报名' 
                    }
                // } else {
                //     if (nowd > end && joindate && joindate.length > 0) {
                //         item.hasjoin = '已完成'
                //     } else if (start < nowd && nowd < end && (joindate && joindate.length > 0)) {
                //         item.hasjoin = '已报名,进行中';
                //     } else if (start < nowd && nowd < end) {
                //         item.hasjoin = '进行中';
                //     } else if(joindate && joindate.length > 0) {
                //         item.hasjoin = '已报名' 
                //     }
                // }
            } else {
                let start = Number(new Date(item.startDate));
                let nowd = Number(new Date());
                let end = Number(new Date(item.endDate));

                if (start < nowd && nowd < end) {
                    item.hasjoin = '进行中';
                } else if (end < nowd) {
                    item.hasjoin = '已结束'
                } else {
                    item.hasjoin = '未开始';
                }
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
            if (!think.isEmpty(studentid)) {
                let joindate = await this.model('student_activity').getActivityHasJoin(studentid,data.activityID, 1);
                

                let start = Number(new Date(data.startDate));
                let nowd = Number(new Date());
                let end = Number(new Date(data.endDate));
            console.log('getactivitydetail', start, nowd, end, joindate)

                // 1561046400000 1560347475342 1561737600000
                if (nowd > end && joindate && joindate.length > 0) {
                    data.hasjoin = '已完成'
                } else if (start < nowd && nowd < end && (joindate && joindate.length > 0)) {
                    data.hasjoin = '已报名,进行中';
                } else if (start < nowd && nowd < end) {
                    data.hasjoin = '进行中';
                } else if(joindate && joindate.length > 0) {
                    data.hasjoin = '已报名' 
                }
                
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
            let joindate = await this.model('student_activity').getStudentIsJoinGroup(studentid,data.activityID, 1);
            let start = Number(new Date(data.startDate));
            let nowd = Number(new Date());
            let end = Number(new Date(data.endDate));

            // console.log('joindate----group-', joindate.length)
            // if (nowd > end && joindate && joindate.length > 0) {
            //     data.hasjoin = '已完成'
            // } else if(joindate && joindate.length > 0) {
            //     data.hasjoin = '已报名' 
            // } else if (start < nowd && nowd < end) {
            //     data.hasjoin = '进行中';
            // }
            if (joindate && joindate.iscomplate) {
                data.hasjoin = '已完成'
            } else if (start < nowd && nowd < end && ((joindate && joindate.isAttentention))) {
                data.hasjoin = '已报名,进行中';
            } else if (start < nowd && nowd < end) {
                data.hasjoin = '进行中';
            } else if(joindate && joindate.isAttentention) {
                data.hasjoin = '已报名' 
            }

            data.group=await this.model('group').where({activityid:data.activityID, studentid: studentid}).select();
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
        const data = await model.query("select distinct(s.sceneryid),s.activityid,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s inner join culture_activity a on a.activityID=s.activityid inner join culture_scenery sc on s.sceneryid=sc.sceneryID where "+idcondition+" and a.activityID limit "+start+","+pagesize+" ");
        const counta = await model.query("select count(*) t from (select distinct(s.sceneryid),s.activityid,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s inner join culture_activity a on a.activityID=s.activityid inner join culture_scenery sc on s.sceneryid=sc.sceneryID where "+idcondition+" ) t");
        const pagecount = Math.ceil(counta[0].t / pagesize);

        const arrdata = [];
        let arrScen = [];
        let arrSchool = []
        for (const item of data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityid);
            item.shstate = await this.model('activity').getstate(item.activityid);
            if (!think.isEmpty(studentid)) {
                item.sceneryState = await this.model('scenery').getstudentstate(item.sceneryid, studentid, item.activityid);
            }

            arrScen.push(item.sceneryid);
            arrSchool.push(item.schoolid)
            // item.question = await this.model('student_activity').studentJoinActivityAndAnswer(studentid,item.activityID,item.questionid)
            arrdata.push(item)
        }
        let complateSceneryNum = 0;
        let complateSchoolNum = 0;
        if (!think.isEmpty(studentid)) {
            complateSceneryNum = await this.model('attention_activity').where({studentid:studentid,activityid:activityid}).count();
            complateSchoolNum = await this.model('student_school').where({studentid:studentid,shstate:1}).count();
        } else {
             complateSceneryNum = await this.model('attention_activity').where({activityid:activityid}).count();
             complateSchoolNum = await this.model('student_school').where({shstate:1}).count();
        }
        arrScen = _.uniq(arrScen);
        arrSchool = _.uniq(arrSchool);
        
        data.data = arrdata;
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,totalScenery:arrScen,totalSchool:arrSchool,complateSceneryNum:complateSceneryNum,complateSchoolNum:complateSchoolNum,data})
    }

    async listAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        let userinfo = await this.model('pagecache').getUserInfo(this.ctx.state.token, this.ctx.state.userId); // '+ this.ctx.state.token);
        console.log('session',userinfo)

        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const endDate = new Date();
        let date = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+' 00:00:00';
        // date = '2019-04-14 00:00:00';
        // console.log('list', date)
        let data = {};
        if (userinfo && userinfo.usertype == 0) {
            data = await model.where({shstate: 0, endDate:{'>': think.datetime(date,'YYYY-MM-DD')}, createbyuserid: userinfo.sysUserID}).order('activityID desc').page(page,size).countSelect();
        } else {
            data = await model.where({shstate: 0, endDate:{'>': think.datetime(date,'YYYY-MM-DD')}}).page(page,size).order('activityID desc').countSelect();
        }
        
        const arrdata = [];

        for (const item of data.data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityID);
            item.sceneryCount = await this.model('activity_scenery').where({activityid:item.activityID}).count('activityid');
            item.questionCount = 1; //await this.model('question').where({activityid:item.activityID}).count('activityid');
            // console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))
        
            item.needSchoolRangName = await this.model('school').getSchoolNameByIds(item.needSchoolRang);
            item.sceneryRange = await this.model('activity_scenery').getsceneryrangebyid(item.activityID);
            // item.shstate = await this.model('activity').getstate(item.activityID);
            arrdata.push(item);
        }
        data.data = arrdata;

        return this.success(data)
    }

    async list2Action() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        let userinfo = await this.model('pagecache').getUserInfo(this.ctx.state.token, this.ctx.state.userId); // await this.cache('userinfo'+ this.ctx.state.token);
        const activityid = this.get('activityid');


        const model = this.model('question');
        model._pk = 'questionID';
        let list = [];
        if (userinfo && userinfo && userinfo.usertype == 0) {
            let condition = {};
            if (think.isEmpty(activityid)|| activityid == 'undefined') {
                condition = {'act.createbyuserid': userinfo.sysUserID, 'q.shstate':0, 'cs.shstate':0, 'act.shstate':0, 's.questionid': ['!=', null]};
            } else {
                condition = {'act.activityid':activityid,'act.createbyuserid': userinfo.sysUserID, 'q.shstate':0, 'cs.shstate':0, 'act.shstate':0, 's.questionid': ['!=', null]};
            }
            list = await model.field(['q.questionID','q.questiontitle','q.answera','q.answerb','q.answerc','q.answerd','q.rightanswer',
                's.sceneryid','s.activityid','cs.sceneryTitle','act.startAddress'])
            .alias('q')
            .join({
                table:'activity_scenery',
                join:'left',
                as: 's',
                on: ['q.sceneryid', 's.sceneryid']
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
            let condition = {};
            if (think.isEmpty(activityid) || activityid == 'undefined') {
                condition = {1: 1, 'q.shstate':0, 'cs.shstate':0, 'act.shstate':0,'s.questionid': ['!=', null]};
            } else {
                condition = {'s.activityid': activityid, 'q.shstate':0, 'cs.shstate':0, 'act.shstate':0,'s.questionid': ['!=', null]};
            }
            list = await model.field(['q.questionID','q.questiontitle','q.answera','q.answerb','q.answerc','q.answerd','q.rightanswer',
                's.sceneryid','s.activityid','cs.sceneryTitle','act.startAddress'])
            .alias('q')
            .join({
                table:'activity_scenery',
                join:'left',
                as: 's',
                on: ['q.sceneryid', 's.sceneryid']
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