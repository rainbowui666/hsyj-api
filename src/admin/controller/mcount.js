const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    async numbListAction() {
       const id = this.get('schoolId')
       let childschoolid = await this.model('school').field(['schoolID']).where({parentid: id}).getField('schoolID')
       const data = await this.model('student').query("select count( DISTINCT studentID) num from culture_student where shstate=4 and  schoolid in ("+childschoolid+")");
       
       const tourist = await this.model('scenery').getTourist(id);
       const students = data[0].num;
       const discuss = await this.model('scenery').getDiscuss(id);
       const activity = await this.model('activity').where({'createbyschoolid':id}).count('1');
       const scenery = await this.model('scenery').getScenery(id);
       
       return this.json({
        tourist,
        students,
        discuss,
        activity,
        scenery
       })
    }

    async topActivityAction() {
        const id = this.get('schoolId')
        const activitys =  await this.model('activity').getManagerTopActivity(id);
        this.trunString(activitys);
        return this.json(activitys)
    }

    async topActivityOrgAction() {
        const id = this.get('schoolId')
        const activitys =  await this.model('school').getStudentCount(id);
        return this.json(activitys)
    }

    async topSceneryAction() {
        const id = this.get('schoolId')
        const scenerys =  await this.model('scenery').getManagerTopScenery(id);
        this.trunString(scenerys);
        return this.json(scenerys)
    }
    async topSignSceneryAction() {
        const id = this.get('schoolId')
        const scenerys =  await this.model('scenery').getTopManagerSignScenery(id);
        this.trunString(scenerys);
        return this.json(scenerys)
    }

    trunString(arrs){
        _.each(arrs,(arr)=>{
            if(arr.name){
                arr.name = arr.name.substring(0,5);
            }
        });
    }

}