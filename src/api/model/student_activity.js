const _ = require('lodash');

module.exports = class extends think.Model {
    async getStudentIsJoinActivity(studentid, activityid, shstate) {
        const data = await this.model('student_activity').where({studentID: studentid, activityid: activityid, shstate: shstate}).select();
        
        return data;
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
}