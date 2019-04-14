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
        return this.success('留言成功')
    }

    async listAction() {
        const model =  this.model('discuss');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const shstate = this.get('shstate');
        const distype = this.get('distype');
        const sceneryid = this.get('sceneryid');
        const activityID = this.get('activityid');
        const schoolid = this.get('schoolid');

        let typeconition = '';
        let scenerycondition = '';
        let activitycondition = '';
        let schoolcondition = '';
        let statusconditionn = '';

        if (think.isEmpty(shstate)) {
            statusconditionn = '1=1 ';
        } else {
            statusconditionn = 'a.shstate='+shstate
        }

        if (think.isEmpty(distype)) {
            typeconition = '1=1 ';
        } else {
            typeconition = 'a.distype='+distype
        }

        if (think.isEmpty(sceneryid)) {
            scenerycondition = '1=1 ';
        } else {
            scenerycondition = 'sceneryid='+sceneryid
        }

        if (think.isEmpty(activityID)) {
            activitycondition = '1=1 ';
        } else {
            activitycondition = 'activityID='+activityID;
        }

        if (think.isEmpty(schoolid)) {
            schoolcondition = '1=1 ';
        } else {
            schoolcondition = 'schoolID='+schoolid;
        }

        const start = (pageindex -1) * pagesize;
        const data = await model.query("select a.discussID,s.studentName,a.distype,a.targetid,a.studentid,a.content,a.shstate,  case  when distype=0 then (select scenerytitle from culture_scenery where "+scenerycondition+") when distype=1 then (select activityname from culture_activity where "+activitycondition+") when distype=2 then (select schoolname from culture_school where "+schoolcondition+") when distype=3 then 'APP首页' end as targetaddress from culture_discuss a left join culture_student s on s.studentid=a.studentid where "+typeconition+" and "+statusconditionn+" and a.discussid limit "+start+","+pagesize+" ");
        return this.success({pageindex:pageindex,pagesize:pagesize,data})
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