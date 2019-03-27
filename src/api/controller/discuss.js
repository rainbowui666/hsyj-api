const Base = require('./base.js');

module.exports = class extends Base {
    async addAction() {
        const distype = this.get('distype');
        const targetid = this.get('targetid') || 0;
        const studentid = this.get('studentid');
        const content = this.post('content');
        const shstate = this.post('shstate') || 0;

        

        const model = this.model('discuss');
        let data = {
            distype,targetid,studentid,content,shstate
        }

        let insertid = await model.add(data);
        return this.success('学留言成功')
    }

    async listAction() {
        const model =  this.model('discuss');

        const data = await model.query("select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where sceneryid=1) when distype=1 then (select activityname from culture_activity where activityID=1) when distype=2 then (select schoolname from culture_school where schoolID=1) when distype=3 then 'APP首页' end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where a.shstate=0");
        return this.success(data)
    }

    async updateAction() {
        const id = this.get('id');
        const shstate = this.get('shstate');
        const data = {
            shstate
        }

        await this.model('discuss').where({discussID:id}).update(data);
        return this.success('修改成功')
    }
}