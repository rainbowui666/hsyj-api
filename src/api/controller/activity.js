const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
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