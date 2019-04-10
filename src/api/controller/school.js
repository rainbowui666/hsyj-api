const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    async indexAction() {
        const page = this.get('page') || 1;
        const size = this.get('size') || 10;
        const schoolname = this.get('schoolname') || '';

        const model = this.model('school');
        model._pk = 'schoolID';
        var data;
        if (schoolname == '') {
            data = await model.page(page, size).countSelect();
        } else {
            data = await model.where({schoolName: ['like', `%${schoolname}%`]}).page(page, size).countSelect();
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

    async detailAction() {
        const id = this.get('id');
        const model = this.model('school');
        // model._pk = 'schoolID';

        const data = await model.where({schoolID: id}).find();

        const arrdata = [];
        if (!think.isEmpty(data)) {
        // for (const item of data.data) {
            data.scenery = await this.model('school').getScenerybyid(data.schoolID);
            data.discussList = await this.model('discuss').getDiscussById(id,2);
        //     // item.shstate = await this.model('school').getstate(item.schoolID);
        //     arrdata.push(item);
        // }
        // data.data = arrdata;
        }
        return this.success(data)
    }

    async deleteAction() {
        const id = this.get('id');
        const data = {
            shstate: 1
        }
        await this.model('school').where({schoolID:id}).update(data);
        return this.success('学校删除成功')
    }
    
    async addEditAction() {
        const schoolname = this.post('schoolname');
        const province = this.post('province') || '';
        const city = this.post('city') || '';
        const address = this.post('address') || '';
        const schooldesc= this.post('schooldesc');
        const longitude = this.post('longitude');
        const latitude = this.post('latitude');
        const soundurl = this.post('soundurl');
        const videourl = this.post('videourl');
        const areaid = this.post('areaid');
        const parentid = this.post('parentid') || 0;
        const id = this.get('id');

        let param = {
            schoolName: schoolname,
            province: province,
            city: city,
            address: address,
            schooldesc: schooldesc,
            longitude: longitude,
            latitude: latitude,
            soundurl,
            videourl,areaid,parentid
        }; 
        if (think.isEmpty(id)) {
            let model = this.model('school');
            const insertid = await model.add(param);
            
            // 上传学校图片
            if (insertid) {
                // const sourceaddress = this.post('sourceaddress');
                // const insertid2 = await this.model('source').add({
                //     sourceType:0,
                //     sourceAddress: sourceaddress,
                //     targetid: insertid
                // });

                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // 1 删除source, 2修改
            await this.model('source').where({targetid:id}).delete();
            await this.model('school').where({schoolID:id}).update(param);
            return this.success('学校修改成功')
        }
        
    }
}