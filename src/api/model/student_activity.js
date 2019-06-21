const _ = require('lodash');

module.exports = class extends think.Model {
    async getActivityHasJoin(studentid, activityid, shstate) {
        const data = await this.model('student_activity').where({studentID: studentid, activityid: activityid, shstate: shstate}).select();
        return data
    }
    // 活动的景点签到
    async getStudentIsJoinActivity(studentid, activityid, shstate) {
        // 取景点阀值
        const actData = await this.model('activity').field(['activityID','needSchoolPass','needSceneryPass']).where({activityID: activityid}).find();
        let needschoolpass = 0;
        let needscenerypass = 0;
        if (!think.isEmpty(actData)) {
            needschoolpass = actData.needSchoolPass;
            needscenerypass = actData.needSceneryPass;
        }

        // 活动景点签到次数
        let realattentscenery = 0; 
        let dataScenery = await this.model('attention_activity').field('sceneryid').where({studentid:studentid,activityid:activityid}).getField('sceneryid');
        if (!think.isEmpty(dataScenery)) {
            realattentscenery = dataScenery.length;
        }

        dataScenery = _.uniq(dataScenery)
        // console.log('dataScenery------',dataScenery)

        // 景点所属学校
        let dataschool = 0;
        if (!think.isEmpty(dataScenery)) {
            dataScenery = dataScenery.join(',');
            dataschool = await this.model('scenery').field('schoolid').where({sceneryID: ['in', dataScenery]}).getField('schoolid');
            dataschool = _.uniq(dataschool)
            // console.log('schoolid------',dataschool)
        }

        let iscomplate = false;
        if (realattentscenery >= needscenerypass && dataschool && dataschool.length >= needschoolpass) {
            iscomplate = true;
        }

        let isAttentention = false;
        if (realattentscenery > 0) {
            isAttentention = true;
        }
        // const data = await this.model('student_activity').where({studentID: studentid, activityid: activityid, shstate: shstate}).select();
        
        return {isAttentention, iscomplate};
    }

    async studentJoinActivityAndAnswer(studentid, activityid,questionid) {
        const data = await this.model('student_activity').where({studentID:studentid,activityid:activityid,shstate:1}).select();
        const questiondata = await this.model('question').where({questionID:questionid}).select();

        return {
            data,questiondata
        }
    }

    async getJoinNum(activityid) {
        const data = await this.model('student_activity').where({activityid:activityid, shstate:1}).select();
        return data ? data.length : 0;
    }

    async getStudentIsJoinGroup(studentid, activityid, shstate) {
        const data = await this.model('student_activity').where({studentID: studentid,activityid:activityid,shstate:shstate}).select();
        // console.log('group-----', data)
        return data;
    }
}