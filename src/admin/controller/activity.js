const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
    async listAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        let userinfo = await this.model('pagecache').getUserInfo(this.ctx.state.token, this.ctx.state.userId); // await this.cache('userinfo' + this.ctx.state.token);
        console.log('session',userinfo)

        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        
        let data = {};
        if (userinfo && userinfo.usertype == 0) {
            data = await model.where({shstate: 0, createbyschoolid: userinfo.schoolid}).order('activityID desc').page(page,size).countSelect();
        } else {
            data = await model.where({shstate: 0 }).page(page,size).order('activityID desc').countSelect();
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
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 10;
        let userinfo = await this.model('pagecache').getUserInfo(this.ctx.state.token, this.ctx.state.userId); // await this.cache('userinfo'+ this.ctx.state.token);
        const activityid = this.get('activityid');

        const model = this.model('activity_scenery');
        let data = []
        let counta;
        if (userinfo && userinfo && userinfo.usertype == 0) {
            data = await model.query("select acsc.sceneryid,s.sceneryTitle,acsc.activityid,act.startAddress,q.questionID,q.questiontitle,q.answera,q.answerb,q.answerc,q.answerd,q.rightanswer from culture_activity_scenery acsc inner join culture_activity act on act.activityID=acsc.activityid inner join culture_scenery s on acsc.sceneryid=s.sceneryID inner join culture_question q on acsc.questionid=q.questionID where acsc.activityid="+activityid);
            counta = await model.query("select count(*) t from (select acsc.sceneryid,s.sceneryTitle,acsc.activityid,act.startAddress,q.questionID,q.questiontitle,q.answera,q.answerb,q.answerc,q.answerd,q.rightanswer from culture_activity_scenery acsc inner join culture_activity act on act.activityID=acsc.activityid inner join culture_scenery s on acsc.sceneryid=s.sceneryID inner join culture_question q on acsc.questionid=q.questionID where acsc.activityid="+activityid+" ) t ");
        }
        const pagecount = Math.ceil(counta[0].t / pagesize);
        this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
    }

    async getdatabyname(name) {
        const model = this.model('pagecache');
        model._pk = 'cacheid';
        const dataname = await model.where({cachename:['like','%'+name+'%']}).select();
        
        if (!think.isEmpty(dataname)) {
            for (let i = 0; i < dataname.length; i++) {
                let name = dataname[i].cachename;
                await this.cache(name, null);
            }
        }
        const data = await model.where({cachename:['like','%'+name+'%']}).delete();
        return data;
    }

    async addEdit1Action() {
        const activityName = this.post('activityname');
        const sponsor = this.post('sponsor') || '';
        const meetingPlace = this.post('meetingplace') || '';
        const secondSponsor = this.post('secondsponsor') || '';
        const needSchoolRang= this.post('needschoolrang');
        const needSceneryRang = this.post('needsceneryrang');

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
        const isrecommend = this.post('isrecommend') || 0;

        const id = this.get('id');
        let userinfo = await this.model('pagecache').getUserInfo(this.ctx.state.token, this.ctx.state.userId); // await this.cache('userinfo' + this.ctx.state.token);

        if (think.isEmpty(userinfo)) {
            return this.fail('请先登录')
        }
        // console.log('session',userinfo[0])

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
            isrecommend,
            groupNum,createbyuserid: userinfo.sysUserID,createbyschoolid:userinfo.schoolid
        }; 
        await this.getdatabyname('home_discuss');
        
        let arr = [];
        if (think.isEmpty(id)) {
            let model = this.model('activity');
            const insertid = await model.add(param);
            
            // 上传活动图片
            if (insertid) {
                if (needSceneryRang.indexOf(',') != -1) {
                    let arrScenery =  needSceneryRang.split(',');
                    console.log('arrscenry', arrScenery)
                    for (let i = 0; i < arrScenery.length; i++) {
                        arr.push({activityid: insertid, sceneryid: arrScenery[i]});
                    }

                    if (arr && arr.length > 0) {
                    await this.model('activity_scenery').addMany(arr);
                    }
                }
                await this.cache('home_activity_scenery', null, 'redis');
                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // 1 删除source, 2修改
            await this.model('activity').where({activityID:id}).update(param);

            if (needSceneryRang.indexOf(',') != -1) {
                // 请求的景点ids
                let arrScenery =  needSceneryRang.split(',');

                // 当前活动有哪些景点[]
                let curSceneryData = await this.model('activity_scenery').field('sceneryid').where({activityid:id}).getField('sceneryid');
                curSceneryData = curSceneryData.join(',').split(',');
                if (curSceneryData && curSceneryData.length > 0) {
                    curSceneryData = _.uniq(curSceneryData);
                }

                // 需要添加的数组
                // console.log('before', arrScenery,curSceneryData)
                let needAddArr = _.difference(arrScenery,curSceneryData);
                if (needAddArr && needAddArr.length > 0) {
                    for (let i = 0; i < needAddArr.length; i++) {
                        arr.push({activityid: id, sceneryid: needAddArr[i]});
                    }
                    console.log('needaddarr', needAddArr)
                    if (arr && arr.length > 0) {
                        await this.model('activity_scenery').addMany(arr);
                    }
                }

                // 需要删除的
                // console.log('after',curSceneryData, arrScenery)
                let needDelArr = _.difference(curSceneryData, arrScenery);
                console.log('needdelarr', needDelArr)
                if (needDelArr && needDelArr.length > 0) {
                    // let dd = await this.model('activity_scenery').where('activityid='+id+' and sceneryid in ('+needDelArr+')').select();
                    // console.log('del---', dd)
                    await this.model('activity_scenery').where('activityid='+id+' and  sceneryid in ('+needDelArr+')').delete();
                }
                await this.cache('home_activity_scenery', null);
            }
            // if (needSceneryRang.indexOf(',') != -1) {
            //     await this.model('activity_scenery').where({activityid:id}).delete();
            //     let arrScenery =  needSceneryRang.split(',');
            //     for (let i = 0; i < arrScenery.length; i++) {
            //         arr.push({activityid: id, sceneryid: arrScenery[i]});
            //     }
            //     // console.log(arr)
            //     if (arr && arr.length > 0) {
            //         await this.model('activity_scenery').addMany(arr);
            //     }
            // }
            // await this.cache('home_activity_scenery', null, 'redis');
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
await this.getdatabyname('home_discuss');
        if (think.isEmpty(id)) {
            const questId = await this.model('question').add(questionData);
            if (questId) {
                let para = {
                    sceneryid,questionid:questId,activityid:activityid
                };
                await this.model('activity_scenery').add(para);
            }
            return this.success('第二步成功');
        } else {
            await this.model('activity_scenery').where({questionid:id}).delete()
            await this.model('question').where({questionID:id}).update(questionData);
            let pa = {
                sceneryid,questionid:id,activityid:activityid
            };
            await this.model('activity_scenery').add(pa);
            return this.success('修改成功')
        }
    }

    async deleteAction() {
        const id = this.get('id');
        // const data = {
        //     shstate: 1
        // }
        await this.getdatabyname('home_discuss');
        this.cache('home_activity_scenery', null);
        await this.model('activity').where({activityID:id}).delete();
        await this.model('group').where({activityid:id}).delete();
        await this.model('student_group').where({activityid:id}).delete();
        await this.model('activity_scenery').where({activityid:id}).delete();
        await this.model('student_activity').where({activityid:id}).delete();
        await this.model('discuss').where({targetid:id,distype:1}).delete();
        return this.success('活动删除成功')
    }

    async delete2Action() {
        const id = this.get('id');
        const activityid = this.get('activityid');
        const sceneryid = this.get('sceneryid');
        const data = {
            shstate: 1
        }
        await this.getdatabyname('home_discuss');
        await this.model('question').where({questionID:id}).delete();
        await this.model('activity_scenery').where({activityid:activityid, questionid: id,sceneryid:sceneryid}).delete();
        return this.success('活动第二步问题删除成功')
    }

    async changeComplateAction() {
        const activityid = this.get('activityid');
        const iscomplate = this.get('iscomplate');
        const para = {
            iscomplate: iscomplate
        }
        const data = this.model('activity').where({activityID:activityid}).update(para);
        return this.success('活动已完成')
    }
}