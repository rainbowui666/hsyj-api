const Base = require('./base.js');

module.exports = class extends Base {
    async getQuestionbyActidAction() {
        // const model = this.model('question');
        const id = this.get('id');
        const ac_scmodel = this.model('activity_scenery');
        const data = await ac_scmodel.field(['sc.*','q.questionTitle','q.questionType','q.answerA','q.answerB'
            ,'q.answerC','q.answerD','q.rightAnswer'])
        .alias('sc')
        .join({
            table: 'question',
            join:'left',
            as: 'q',
            on:['sc.questionid','q.questionID']
        }).where({'sc.activityid':id}).find()
        return this.success(data);
    }
}