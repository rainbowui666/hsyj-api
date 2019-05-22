const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    async indexAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        const schoolname = this.get('schoolname') || '';
        const areaid = this.get('areaid') || '';
        
        const model = this.model('school');
        model._pk = 'schoolID';
        var data;
        if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
            data = await model.where({shstate: 0}).page(page, size).order('schoolID asc').countSelect();
        } else if (!think.isEmpty(schoolname)) {
            data = await model.where({schoolName: ['like', `%${schoolname}%`], shstate: 0}).order('schoolID asc').page(page, size).countSelect();
        } else {
            data = await model.where({areaid: areaid, shstate: 0}).page(page, size).order('schoolID asc').countSelect();
        }
        
        const arrdata = [];
        for (const item of data.data) {
            item.pics = await this.model('school').getPicsbyid(item.schoolID);
            item.shstate = await this.model('school').getstate(item.schoolID);
            arrdata.push(item);
        }
        data.data = arrdata;

        return this.success(data)
    }

    async getSchoolListAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        const schoolname = this.get('schoolname') || '';
        const areaid = this.get('areaid') || '';
        let userinfo = await this.cache('userinfo');
        
        const model = this.model('school');
        model._pk = 'schoolID';
        var data;
        if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
            data = await model.where({schoolID: userinfo[0].schoolid}).page(page, size).countSelect();
        } else if (!think.isEmpty(schoolname)) {
            data = await model.where({schoolName: ['like', `%${schoolname}%`],schoolID: userinfo[0].schoolid}).page(page, size).countSelect();
        } else {
            data = await model.where({areaid: areaid, schoolID: userinfo[0].schoolid}).page(page, size).countSelect();
        }
        
        const arrdata = [];
        for (const item of data.data) {
            item.pics = await this.model('school').getPicsbyid(item.schoolID);
            item.shstate = await this.model('school').getstate(item.schoolID);
            arrdata.push(item);
        }
        data.data = arrdata;
        return this.success(data)
    }

    async getAreaAction() {
        const data = await this.model('area').select();
        return this.success(data);
    }
    
    async detailAction() {
        const id = this.get('schoolid');
        const model = this.model('school');
        // model._pk = 'schoolID';

        const data = await model.where({schoolID: id}).find();

        const arrdata = [];
        if (!think.isEmpty(data)) {
        // for (const item of data.data) {
            data.scenery = await this.model('school').getScenerybyid(data.schoolID);
            data.schoolpics = await this.model('school').getPicsbyid(data.schoolID);
            data.discussList = await this.model('discuss').getDiscussById(id,2);
        //     // item.shstate = await this.model('school').getstate(item.schoolID);
        //     arrdata.push(item);
        // }
        // data.data = arrdata;
        }
        return this.success(data)
    }

    async getChildSchoolAction(){
        const id = this.get('schoolid');
        const data = await this.model('school').where({parentid:id}).select();
        return this.success(data);
    }
}