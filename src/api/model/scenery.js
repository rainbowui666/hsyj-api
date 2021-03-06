const _ = require('lodash');

module.exports = class extends think.Model {
    async getPicsbyid(id) {
        const data = await this.model('source').where({sourceType: 1, targetid: id}).select();
        return data;
    }

    async getstate(id) {
        const model = this.model('student_scenery');
        model._pk = 'sceneryid';
        // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
        const wantto = await model.where({sceneryid: id, shstate: 0}).count('sceneryid');
        // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

        const modeldis = this.model('discuss');
        modeldis._pk = 'discussID';
        const disnum = await modeldis.where({distype: 0, targetid: id, shstate: 1}).count('discussID');
        return {
            // checkin: checkin,
            wantto: wantto,
            // sharenum: sharenum,
            disnum: disnum
        }
    }

    async getstudentstate(sceneryid, studentid, activityid) {
        const model = this.model('student_scenery');
        model._pk = 'sceneryid';
        // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
        const wantto = await model.where({sceneryid: sceneryid, shstate: 0, studentid: studentid}).count('sceneryid');
        let checkin = 0;
        if (!think.isEmpty(activityid)) {
            checkin = await this.model('attention_activity').where({studentid:studentid,sceneryid:sceneryid,activityid:activityid}).count('sceneryid');
         } else {
            checkin = await model.where({sceneryid: sceneryid, shstate: 1, studentid: studentid}).count('sceneryid');
         } // 
        // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

        const modeldis = this.model('discuss');
        modeldis._pk = 'discussID';
        const disnum = await modeldis.where({distype: 0, targetid: sceneryid, shstate: 1, studentid: studentid}).count('discussID');
        return {
            // checkin: checkin,
            wantto: wantto,
            checkin,
            // sharenum: sharenum,
            disnum: disnum
        }
    }

    async getactivitystudentstate(sceneryid, studentid, activityid) {
        const model = this.model('student_scenery');
        model._pk = 'sceneryid';
        // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
        const wantto = await model.where({sceneryid: sceneryid, shstate: 0, studentid: studentid}).count('sceneryid');
        const checkin = await this.model('attention_activity').where({sceneryid: sceneryid, shstate: 1, studentid: studentid, activityid: activityid}).count('sceneryid');
        // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

        const modeldis = this.model('discuss');
        modeldis._pk = 'discussID';
        const disnum = await modeldis.where({distype: 0, targetid: sceneryid, shstate: 1, studentid: studentid}).count('discussID');
        return {
            // checkin: checkin,
            wantto: wantto,
            checkin,
            // sharenum: sharenum,
            disnum: disnum
        }
    }

    async getTopScenery(id) {
        const activitys = await this.query('select sceneryid,count(sceneryid) num  from culture_attention_activity where activityid='+id+' GROUP BY sceneryid  order by num desc limit 5');
        const topActive = [];

        for(const activity of activitys ){
            const name = await this.model('scenery').where({sceneryID:activity.sceneryid}).find();
            topActive.push({
                name:name.sceneryTitle,
                num:activity.num
            })
        }
        return topActive;
    }

    async getTopGroupStudent(stuid,id) {
        const nums = await this.query('select count(DISTINCT sceneryid) num, min(createdate) time ,max(createdate) mtime  from culture_attention_activity where studentid='+stuid+' and activityid='+id+'');
        return nums;
    }
} 