const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    async frontListAction() {
        const page = this.get('page') || 1;
        const size = this.get('size') || 10;
        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const endDate = new Date();
        const date = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+' 00:00:00'
        const data = await model.where({shstate: 0, endDate:{'>': date}}).page(page,size).countSelect();

        const arrdata = [];

        for (const item of data.data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityID);
            console.log(Number(new Date(item.startDate)), Number(new Date()), Number(new Date(item.endDate)))
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
        const start = (pageindex -1) * pagesize;
        const data = await model.query("select s.*,a.activityName,a.startSceneryid,a.endSceneryid,sc.schoolid,sc.address,sc.shdesc,sc.longitude,sc.latitude,sc.sctype,sc.shstate,sc.sceneryTitle from culture_activity_scenery as s left join culture_activity a on a.activityID=s.activityid left join culture_scenery sc on s.sceneryid=sc.sceneryID where a.activityID limit "+start+","+pagesize+" ");
        
        const arrdata = [];
        for (const item of data) {
            item.shstate = await this.model('activity').getstate(item.activityid);
            // item.question = await this.model('student_activity').studentJoinActivityAndAnswer(studentid,item.activityID,item.questionid)
            arrdata.push(item)
        }
        data.data = arrdata;
        return this.success({pageindex:pageindex,pagesize:pagesize,data})
    }

    async listAction() {
        const page = this.get('page') || 1;
        const size = this.get('size') || 10;
        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        const endDate = new Date();
        const date = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+' 00:00:00'
        const data = await model.where({shstate: 0, endDate:{'>': date}}).page(page,size).countSelect();

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
        const page = this.get('page') || 1;
        const size = this.get('size') || 10;
        
        const model = this.model('question');
        model._pk = 'questionID';
        const list = await model.field(['q.questionID','q.questiontitle','q.answera','q.answerb','q.answerc','q.answerd','q.rightanswer',
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
        }).page(page, size).countSelect();

        
        return this.success(list)
    }

    async addEdit1Action() {
        const activityName = this.post('activityname');
        const sponsor = this.post('sponsor') || '';
        const meetingPlace = this.post('meetingplace') || '';
        const secondSponsor = this.post('secondsponsor') || '';
        const needSchoolRang= this.post('needschoolrang');

        const startDate = this.post('startdate');
        const endDate = this.post('enddate');
        const shdesc = this.post('shdesc');

        const shstate = this.post('shstate');
        const startAddress = this.post('startaddress');
        const needSchoolPass = this.post('needschoolpass');
        const needSceneryPass = this.post('needscenerypass');
        const settingStart = this.post('settingstart');
        const startSceneryid = this.post('startsceneryid');

        const settingEnd = this.post('settingend');
        const endSceneryid = this.post('endsceneryid');
        const isGroup = this.post('isgroup');
        const groupNum = this.post('groupnum');

        const id = this.get('id');

        let param = {
            activityName,
            sponsor,
            meetingPlace,
            secondSponsor,
            needSchoolRang,
            startDate,
            endDate,
            shdesc,
            shstate,
            startAddress,
            needSchoolPass,
            needSceneryPass,
            settingStart,
            startSceneryid,
            settingEnd,
            endSceneryid,
            isGroup,
            groupNum
        }; 
        if (think.isEmpty(id)) {
            let model = this.model('activity');
            const insertid = await model.add(param);
            
            // 上传活动图片
            if (insertid) {
                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // 1 删除source, 2修改
            await this.model('source').where({targetid:id}).delete();
            await this.model('activity').where({activityID:id}).update(param);
            return this.success('活动修改成功')
        }
        
    }

    async addEdit2Action() {
        const sceneryid = this.post('sceneryid');
        const questiontitle = this.post('questiontitle');
        const questiontype = this.post('questiontype') || 0;
        const answera = this.post('answera');
        const answerb = this.post('answerb');
        const answerc = this.post('answerc');
        const answerd = this.post('answerd');
        const rightanswer = this.post('rightanswer');
        const id = this.get('id');
        const activityid = this.get('activityid');

        const questionData = {
            sceneryid:sceneryid,
            questionTitle:questiontitle,
            questionType:questiontype,
            answerA: answera,
            answerB: answerb,
            answerC: answerc,
            answerD: answerd,
            rightAnswer: rightanswer
        }

        if (think.isEmpty(id)) {
            const questId = await this.model('question').add(questionData);
            if (questId) {
                await this.model('activity_scenery').add({
                    sceneryid,questionid:questId,activityid:activityid
                });
            }
            return this.success('第二步成功');
        } else {
            await this.model('activity_scenery').where({questionid:id}).delete()
            await this.model('question').where({questionID:id}).update(questionData);
            await this.model('activity_scenery').add({
                sceneryid,questionid:id,activityid:activityid
            });
            return this.success('修改成功')
        }
    }

    async deleteAction() {
        const id = this.get('id');
        const data = {
            shstate: 1
        }
        await this.model('activity').where({activityID:id}).update(data);
        return this.success('活动删除成功')
    }

    async delete2Action() {
        const id = this.get('id');
        const data = {
            shstate: 1
        }
        await this.model('question').where({questionID:id}).update(data);
        return this.success('活动第二步问题删除成功')
    }
}