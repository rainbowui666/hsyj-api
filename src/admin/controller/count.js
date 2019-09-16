const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    async numbListAction() {
       const tourist = await this.model('scenery').getAdminTourist();
       const students = await this.model('student').where({'stuNo':['!=',null]}).count('1');
       const discuss = await this.model('discuss').count('1');
       const activity = await this.model('activity').count('1');
       const scenery = await this.model('scenery').count('1');
         
       return this.json({
        tourist,
        students,
        discuss,
        activity,
        scenery
       })
    }

    async topActivityAction() {
        const activitys =  await this.model('activity').getTopActivity();
        // this.trunString(activitys);
        return this.json(activitys)
    }

    async topActivityOrgAction() {
        const activitys =  await this.model('activity').topActivityOrg();
        // this.trunString(activitys);
        return this.json(activitys)
    }

    async topSceneryAction() {
        const scenerys =  await this.model('scenery').getTopScenery();
        // this.trunString(scenerys);
        return this.json(scenerys)
    }
    async topSignSceneryAction() {
        const scenerys =  await this.model('scenery').getTopSignScenery();
        // this.trunString(scenerys);
        return this.json(scenerys)
    }

    trunString(arrs){
        _.each(arrs,(arr)=>{
            if(arr.name){
                arr.name = arr.name.substring(0,5);
            }
            if(arr.sponsor){
                arr.sponsor = arr.sponsor.substring(0,5);
            }
        });
    }

}