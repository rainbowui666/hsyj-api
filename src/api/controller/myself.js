const Base = require('./base.js');

module.exports = class extends Base {
    async getMyallAction() {
        const id = this.get('studentid');
        const shstate = this.get('shstate');
        const data = await this.model('student_activity').query("select count(studentID) as attentionActivityTimes,(select count(studentID) as attentions from culture_student_activity where studentid="+id+" and shstate="+shstate+") attentionSceneryTimes from culture_student_scenery where studentid="+id+" and shstate="+shstate+"")
        return this.success(data)
    }

    async getMyAttentionAction() {
        const id = this.get('studentid');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const start = (pageindex -1) * pagesize;
        const model =  this.model('student');
        model._pk = "studentID";

        const data = await model.query("select ssc.*, sc.schoolid,sc.longitude,sc.latitude,sc.sceneryTitle from culture_student_scenery ssc left join culture_scenery sc on ssc.sceneryid=sc.sceneryID where ssc.shstate=1 and ssc.studentid="+id+" limit "+start+","+pagesize+"");
        
        const arrdata = [];
        for (const item of data) {
            item.pics = await this.model('scenery').getPicsbyid(item.sceneryid);
            arrdata.push(item);
        }
        data.data = arrdata;

        return this.success(data)
    }

    async getMyActivityListAction() {
        const id = this.get('studentid');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const start = (pageindex -1) * pagesize;
        const model =  this.model('student');
        model._pk = "studentID"
        const data = await model.query("select sa.*, a.activityName,a.sponsor,a.startDate, a.endDate from culture_student_activity sa left join culture_activity a on sa.activityid=a.activityid where sa.studentid="+id+" limit "+start+","+pagesize+"");
        const arrdata = [];
        for (const item of data) {
            item.pics = await this.model('activity').getPicsbyid(item.activityid);
            let joindate = await this.model('student_activity').getStudentIsJoinActivity(id,item.activityid);
            if (Number(new Date()) > Number(new Date(item.endDate)) && joindate && joindate.length > 0) {
                item.hasjoin = '已完成'
            } else if(item.hasjoin = joindate && joindate.length > 0) {
                item.hasjoin = '已报名' 
            } else {
                item.hasjoin = '';
            }
            arrdata.push(item);
        }
        data.data = arrdata;
        return this.success(data);
    }
}