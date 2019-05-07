const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
    async listAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        let userinfo = await this.cache('userinfo');
        console.log('session',userinfo)

        const studentid = this.get('studentid');
        const model = this.model('activity');
        model._pk = 'activityID';
        
        let data = {};
        if (userinfo && userinfo[0].usertype == 0) {
            data = await model.where({shstate: 0, createbyuserid: userinfo[0].sysUserID}).order('activityID desc').page(page,size).countSelect();
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
        let userinfo = await this.cache('userinfo');

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
            groupNum,createbyuserid: userinfo[0].sysUserID
        }; 
        // await this.model('pagecache').getdatabyname('home_discuss');
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
                // await this.cache('home_activity_scenery', null, 'redis');
                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // 1 删除source, 2修改
            // await this.model('source').where({targetid:id}).delete();        
            await this.model('activity').where({activityID:id}).update(param);

            if (needSceneryRang.indexOf(',') != -1) {
                await this.model('activity_scenery').where({activityid:id}).delete();
                let arrScenery =  needSceneryRang.split(',');
                for (let i = 0; i < arrScenery.length; i++) {
                    arr.push({activityid: id, sceneryid: arrScenery[i]});
                }
                // console.log(arr)
                if (arr && arr.length > 0) {
                    await this.model('activity_scenery').addMany(arr);
                }
            }
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
await this.model('pagecache').getdatabyname('home_discuss');
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
        await this.model('pagecache').getdatabyname('home_discuss');
        await this.model('activity').where({activityID:id}).update(data);
        return this.success('活动删除成功')
    }

    async delete2Action() {
        const id = this.get('id');
        const data = {
            shstate: 1
        }
        await this.model('pagecache').getdatabyname('home_discuss');
        await this.model('question').where({questionID:id}).update(data);
        return this.success('活动第二步问题删除成功')
    }
}