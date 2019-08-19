const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    async numbListAction() {
       const id = this.get('schoolId')
       const sch = await this.model('school').where({parentid:id}).find();
       const tourist = await this.model('scenery').getTourist(id);
       const students = await this.model('student').where({'schoolid':id,shstate:4}).count('1');
       const discuss = await this.model('scenery').getDiscuss(id);
       const activity = await this.model('activity').where({'createbyschoolid':id}).count('1');
       const scenery = await this.model('scenery').where({'schoolid':sch.schoolID}).count('1');
       
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
        return this.json(activitys)
    }

    async topActivityOrgAction() {
        const id = this.get('schoolId')
        const activitys =  await this.model('activity').topManagerActivityOrg(id);
        return this.json(activitys)
    }

    async topSceneryAction() {
        const id = this.get('schoolId')
        const scenerys =  await this.model('scenery').getManagerTopScenery(id);
        return this.json(scenerys)
    }
    async topSignSceneryAction() {
        const id = this.get('schoolId')
        const scenerys =  await this.model('scenery').getTopManagerSignScenery(id);
        return this.json(scenerys)
    }

}