const _ = require('lodash');

module.exports = class extends think.Model {
    async getPicsbyid(id) {
        const data = await this.model('source').where({sourceType: 2, targetid: id}).select();
        return data;
    }

    async getTopActivity() {
        const names = await this.query('select activityName from culture_activity where activityID in (select  a.activityid from (select activityid,count(activityid) num  from culture_student_activity group by activityid order by num desc limit 5) a)')
        const activitys = await this.query('select activityid,count(activityid) num  from culture_student_activity group by activityid order by num desc limit 5');
        const topActive = [];

        for(let i=0;i<names.length;i++){
            topActive.push({
                name:names[i].activityName,
                num:activitys[i].num
            })
        }
        return topActive;
    }
    async getManagerTopActivity(id) {
        const names = await this.query('select activityName from culture_activity where activityID in (select  a.activityid from (select activityid,count(activityid) num  from culture_student_activity where  activityid in (select activityID from culture_activity where createbyschoolid='+id+') group by activityid order by num desc limit 5) a)')
        const activitys = await this.query('select activityid,count(activityid) num  from culture_student_activity where  activityid in (select activityID from culture_activity where createbyschoolid='+id+') group by activityid order by num desc limit 5');
        const topActive = [];

        for(let i=0;i<names.length;i++){
            topActive.push({
                name:names[i].activityName,
                num:activitys[i].num
            })
        }
        return topActive;
    }

    async topActivityOrg() {
        const sponsor = await this.query('select sponsor,count(sponsor) num  from culture_activity group by sponsor order by num desc limit 5');
        return sponsor;
    }
    async topManagerActivityOrg(id) {
        const sponsor = await this.query('select sponsor,count(sponsor) num  from culture_activity where createbyschoolid='+id+' group by sponsor order by num desc limit 5');
        return sponsor;
    }
}