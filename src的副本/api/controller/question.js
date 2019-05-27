const Base = require('./base.js');

module.exports = class extends Base {
    async getQuestionbyActidAction() {
        // const model = this.model('question');
        // const id = this.get('id');
        // const ac_scmodel = this.model('activity_scenery');
        // const data = await ac_scmodel.field(['sc.*','q.questionTitle','q.questionType','q.answerA','q.answerB'
        //     ,'q.answerC','q.answerD','q.rightAnswer'])
        // .alias('sc')
        // .join({
        //     table: 'question',
        //     join:'left',
        //     as: 'q',
        //     on:['sc.questionid','q.questionID']
        // }).where({'sc.activityid':id}).find()
        const activityid = this.get('activityid');
        const sceneryid = this.get('sceneryid');

        const model = this.model('activity_scenery');
        let data = null;
        if (!think.isEmpty(activityid) && !think.isEmpty(sceneryid)) {
            data = await model.query("select aa.activityid,q.* from culture_activity_scenery aa inner join culture_question q on q.sceneryid=aa.sceneryid where aa.activityid="+activityid+" and aa.sceneryid="+sceneryid);
        } else if(!think.isEmpty(activityid)) {
            data = await model.query("select aa.activityid,q.* from culture_activity_scenery aa inner join culture_question q on q.sceneryid=aa.sceneryid where aa.activityid="+activityid);
        } else if(!think.isEmpty(sceneryid)) {
            data = await model.query("select aa.activityid,q.* from culture_activity_scenery aa inner join culture_question q on q.sceneryid=aa.sceneryid where aa.sceneryid="+sceneryid);
        }
        return this.success(data);
    }
}