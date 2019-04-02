const _ = require('lodash');

module.exports = class extends think.Model {
    async getStudentIsJoinActivity(studentid, activityid) {
        const data = await this.model('student_activity').where({studentID: studentid, activityid: activityid}).select();
        
        return data;
    }
}