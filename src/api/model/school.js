const _ = require('lodash');

module.exports = class extends think.Model {
    async getPicsbyid(id) {
        const data = await this.model('source').where({sourceType: 0, targetid: id}).select();
        return data;
    }

    async getScenerybyid(id) {
        const model = this.model('scenery');
        model._pk = 'sceneryID';
        const data = await model.where({schoolid: id, shstate:0}).select();

        const arrdata = [];
        for (const item of data) {
            // item.pics = item
            item.pics = await this.getPicsbyid(item.sceneryID);
            item.shstate = await this.getstate(item.schoolid);
            arrdata.push(item);
        }
        data.data = arrdata;
        return data;
    }

    async getstate(id) {
        const model = this.model('student_school');
        model._pk = 'schoolid';
        // const checkin = await model.where({schoolid: id, shstate: 1}).count('schoolid');
        const wantto = await model.where({schoolid: id, shstate: 0}).count('schoolid');
        // const sharenum = await model.where({schoolid: id, shstate: 4}).count('schoolid');

        const modeldis = this.model('discuss');
        modeldis._pk = 'discussID';
        const disnum = await modeldis.where({distype: 2, targetid: id, shstate: 1}).count('discussID');
        return {
            // checkin: checkin,
            wantto: wantto,
            // sharenum: sharenum,
            disnum: disnum
        }
    }
}