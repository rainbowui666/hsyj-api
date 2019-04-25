const Base = require('./base.js');
const _ = require('lodash');
const fs = require('fs');

module.exports = class extends Base {
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

        const id = this.get('id');
        let userinfo = await this.cache('userinfo');
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
            groupNum,createbyuserid: userinfo[0].sysUserID
        }; 
        if (think.isEmpty(id)) {
            let model = this.model('activity');
            const insertid = await model.add(param);
            
            // 上传活动图片
            if (insertid) {
                let arr = [];
                let arrScenery =  needSceneryRang && needSceneryRang.indexOf(',') != -1 ? needSceneryRang.split(','):[];
                for (let i = 0; i < arrScenery.length; i++) {
                    arr.push({activityid: insertid, sceneryid: needSceneryRang[i]});
                }
                console.log(arr)
                if (arr && arr.length > 0) {
                await this.model('activity_scenery').addMany(arr);
                }
                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // 1 删除source, 2修改
            await this.model('source').where({targetid:id}).delete();
            await this.model('activity_scenery').where({activityid:id}).delete();
            await this.model('activity').where({activityID:id}).update(param);

            let arrScenery =  needSceneryRang && needSceneryRang.indexOf(',') != -1 ? needSceneryRang.split(','):[];
            for (let i = 0; i < arrScenery.length; i++) {
                arr.push({activityid: insertid, sceneryid: needSceneryRang[i]});
            }
            // console.log(arr)
            if (arr && arr.length > 0) {
                await this.model('activity_scenery').addMany(arr);
            }

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