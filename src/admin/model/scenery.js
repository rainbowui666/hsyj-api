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

    async getTopScenery() {
        const names = await this.query('select sceneryTitle from culture_scenery where sceneryID in (select  a.sceneryid from (select sceneryid,count(sceneryid) num  from culture_student_scenery group by sceneryid order by num desc limit 5) a)')
        const activitys = await this.query('select sceneryid,count(sceneryid) num  from culture_student_scenery group by sceneryid order by num desc limit 5');
        const topActive = [];

        for(let i=0;i<names.length;i++){
            topActive.push({
                name:names[i].sceneryTitle,
                num:activitys[i].num
            })
        }
        return topActive;
    }
    async getManagerTopScenery(id) {
        const names = await this.query('select sceneryTitle from culture_scenery where sceneryID in (select  a.sceneryid from (select sceneryid,count(sceneryid) num  from culture_student_scenery where sceneryid in (select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+')) group by sceneryid order by num desc limit 5) a)')
        const activitys = await this.query('select sceneryid,count(sceneryid) num  from culture_student_scenery where sceneryid in (select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+')) group by sceneryid order by num desc limit 5');
        const topActive = [];

        for(let i=0;i<names.length;i++){
            topActive.push({
                name:names[i].sceneryTitle,
                num:activitys[i].num
            })
        }
        return topActive;
    }

    async getTopSignScenery() {
        const names = await this.query('select schoolName from culture_school where schoolID in (select a.schoolid from (select schoolid,count(schoolid) num from culture_student where studentID in (select studentid from culture_student_scenery where studentid in (select studentid from culture_student where schoolid is not null)) group by schoolid order by num desc) a)')
        const activitys = await this.query('select schoolid,count(schoolid) num from culture_student where studentID in (select studentid from culture_student_scenery where studentid in (select studentid from culture_student where schoolid is not null)) group by schoolid order by num desc');
        const topActive = [];

        for(let i=0;i<names.length;i++){
            topActive.push({
                name:names[i].schoolName,
                num:activitys[i].num
            })
        }
        return topActive;
    }
    async getTopManagerSignScenery(id) {
        const names = await this.query('select schoolName from culture_school where schoolID in (select a.schoolid from (select schoolid,count(schoolid) num from culture_student where studentID in (select studentid from culture_student_scenery where studentid in (select studentid from culture_student where schoolid in (select schoolId from culture_school where parentid='+id+'))) group by schoolid order by num desc) a)')
        const activitys = await this.query('select schoolid,count(schoolid) num from culture_student where studentID in (select studentid from culture_student_scenery where studentid in (select studentid from culture_student where schoolid in (select schoolId from culture_school where parentid='+id+'))) group by schoolid order by num desc');
        const topActive = [];

        for(let i=0;i<names.length;i++){
            topActive.push({
                name:names[i].schoolName,
                num:activitys[i].num
            })
        }
        return topActive;
    }

    async getTourist(id) {
        const num1 = await this.query('select count(1) count from culture_discuss where targetid in ( select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+'))');
        const num2 = await this.query('select count(1) count from culture_student_scenery where sceneryid in ( select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+'))');
        return num1[0].count+num2[0].count;
    }

    async getDiscuss(id) {
        const num1 = await this.query('select count(1) count from culture_discuss where targetid in ( select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+'))');
        const num2 = await this.query('select count(1) count from culture_discuss where targetid in ( select activityID from culture_activity where createbyschoolid='+id+')');
        return num1[0].count+num2[0].count;
    }

    async getScenery(id) {
        const num1 = await this.query('select count(1) count from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+')');
        return num1[0].count;
    }
}
