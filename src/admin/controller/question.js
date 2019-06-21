const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const questionid = this.post('questionid');
        const questiontitle = this.post('questiontitle');
        const answera = this.post('answera');
        const answerb = this.post('answerb');
        const answerc = this.post('answerc');
        const answerd = this.post('answerd');
        const rightanswer = this.post('rightanswer');

        let para = {
            questionTitle: questiontitle,
            answerA: answera,
            answerB: answerb,
            answerC: answerc,
            answerD: answerd,
            rightAnswer: rightanswer
        }
        if (!think.isEmpty(questionid)) {
            await this.model('question').where({questionID:questionid}).update(para);
            return this.success('活动修改成功');
        }
        return this.fail('活动id必须要传')
    }
}