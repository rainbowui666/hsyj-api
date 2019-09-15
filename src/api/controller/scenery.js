const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    async indexAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        const scenerytitle = this.get('scenerytitle') || '';

        const model = this.model('scenery');
        model._pk = 'sceneryID';

        var data;
        if (scenerytitle == '') {
            data = await model.where({shstate:0}).page(page, size).order('sceneryID desc').countSelect();
        } else {
            data = await model.where({sceneryTitle: ['like', `%${scenerytitle}%`], shstate:0}).order('sceneryID desc').page(page, size).countSelect();
        }
        const arrdata = [];
        for (const item of data.data) {
            item.pics = await this.model('scenery').getPicsbyid(item.sceneryID);
            item.shstate = await this.model('scenery').getstate(item.sceneryID);
            arrdata.push(item);
        }
        data.data = arrdata;
        return this.success(data)
    }

    async getSceneryListBySchoolidsAction() {
        const schoolids = this.get('schoolids');
        const data = await this.model('scenery').where({schoolid:['IN', schoolids]}).select();
        return this.success(data)
    }

    async getscenerydetailAction() {
        const id = this.get('id');
        const studentid = this.get('studentid');
        const model = this.model('scenery');
        model._pk = 'sceneryID';
        const data = await model.where({sceneryID: id}).find();
        if (!think.isEmpty(data)) {
            data.pics = await this.model('scenery').getPicsbyid(data.sceneryID);
            data.shstate = await this.model('scenery').getstudentstate(data.sceneryID, studentid);
            data.discussList = await this.model('discuss').getDiscussById(id,0);
        }
        return this.success(data);
    }

    async getActivitySceneryDetailAction() {
        const id = this.get('sceneryid');
        const studentid = this.get('studentid');
        const activityid = this.get('activityid');

        const model = this.model('scenery');
        model._pk = 'sceneryID';
        const data = await model.where({sceneryID: id}).find();
        if (!think.isEmpty(data)) {
            data.pics = await this.model('scenery').getPicsbyid(data.sceneryID);
            data.shstate = await this.model('scenery').getactivitystudentstate(data.sceneryID, studentid, activityid);
            data.discussList = await this.model('discuss').getDiscussById(id,0);
        }
        return this.success(data);
    }

    async getUnsignCountExceptEndSceneryAction() {
        const activityid = this.get('activityid');
        const groupid = this.get('groupid');
        const model = this.model('scenery');
        const count = await model.query("select count(*) unsigncount from culture_activity_scenery cas left join culture_activity a on cas.activityid=a.activityid left join culture_group g on g.activityid=cas.activityid left join culture_attention_activity aa on aa.studentid=g.studentid and aa.activityid=g.activityid and aa.sceneryid=cas.sceneryid  where a.activityid="+activityid+" and g.groupid="+groupid+" and cas.sceneryid<>a.endSceneryid and a.endSceneryid is not null and aa.createdate is null");
        return this.success(count);
    }

    async getPersonUnsignCountExceptEndSceneryAction() {
        const activityid = this.get('activityid');
        const studentid = this.get('studentid');
        const model = this.model('scenery');
        const count = await model.query("select count(*) unsigncount from culture_activity_scenery cas left join culture_activity a on a.activityid=cas.activityid left join culture_attention_activity aa on aa.activityid=cas.activityid and aa.sceneryid=cas.sceneryid and aa.studentid="+studentid+" where a.activityid="+activityid+" and cas.sceneryid<>a.endSceneryid and a.endSceneryid is not null and aa.createdate is null");
        return this.success(count);
    }

    async detailAction() {
        const id = this.get('id');
        const model = this.model('scenery');
        const data = await model.where({sceneryID: id}).find();

        const arrdata = [];
        // for (const item of data.data) {
            data.scenery = await this.model('school').getScenerybyid(data.sceneryID);
        //     // item.shstate = await this.model('school').getstate(item.schoolID);
        //     arrdata.push(item);
        // }
        // data.data = arrdata;
        return this.success(data)
    }


}