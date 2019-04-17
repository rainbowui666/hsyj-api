const Base = require('./base.js');

module.exports = class extends Base {
    async indexAction() {
        const page = this.get('page') || 1;
        const size = this.get('size') || 10;
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
        const model = this.model('scenery');
        model._pk = 'sceneryID';
        const data = await model.where({sceneryID: id}).find();
        if (!think.isEmpty(data)) {
            data.pics = await this.model('scenery').getPicsbyid(data.sceneryID);
            data.shstate = await this.model('scenery').getstate(data.sceneryID);
            data.discussList = await this.model('discuss').getDiscussById(id,0);
        }
        return this.success(data);
    }

    async deleteAction() {
        const id = this.get('id');
        const data = {
            shstate: 1
        }
        await this.model('scenery').where({sceneryID:id}).update(data);
        return this.success('删除成功')
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

    async addEditAction() {
        const sceneryTitle = this.post('scenerytitle');
        const schoolid = this.post('schoolid');
        const address = this.post('address') || '';
        const shdesc= this.post('shdesc');
        const longitude = this.post('longitude');
        const latitude = this.post('latitude');
        const soundurl = this.post('soundurl');
        const videourl = this.post('videourl');
        const id = this.get('id');

        let param = {
            sceneryTitle: sceneryTitle,
            schoolid: schoolid,
            address: address,
            shdesc: shdesc,
            longitude: longitude,
            latitude: latitude,
            soundurl,
            videourl
        }; 
        if (think.isEmpty(id)) {
            let model = this.model('scenery');
            const insertid = await model.add(param);
            
            // 上传景点图片
            if (insertid) {
                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // 1 删除source, 2修改
            await this.model('source').where({targetid:id}).delete();
            await this.model('scenery').where({sceneryID:id}).update(param);
            return this.success('景点修改成功')
        }
        
    }
}