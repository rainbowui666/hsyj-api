const _ = require('lodash');

module.exports = class extends think.Model {
    async getPicsbyid(id) {
        const data = await this.model('source').where({sourceType: 2, targetid: id}).select();
        return data;
    }

    async getstate(id) {
        const model = this.model('student_activity');
        model._pk = 'activityid';
        // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
        const wantto = await model.where({activityid: id, shstate: 0}).count('activityid');
        // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

        const modeldis = this.model('discuss');
        modeldis._pk = 'discussID';
        const disnum = await modeldis.where({distype: 1, targetid: id, shstate: 1}).count('discussID');
        return {
            // checkin: checkin,
            wantto: wantto,
            // sharenum: sharenum,
            disnum: disnum
        }
    }
}