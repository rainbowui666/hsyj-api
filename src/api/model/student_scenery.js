const _ = require('lodash');

module.exports = class extends think.Model {
    async getJoinNum(sceneryID) {
        const data = await this.model('student_scenery').where({sceneryID:sceneryID, shstate:1}).select();
        return data ? data.length : 0;
    }
}