const Base = require('./base.js');

module.exports = class extends Base {
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
        let userinfo = await this.cache('userinfo');

        let param = {
            schoolName: schoolname,
            province: province,
            city: city,
            address: address,
            schooldesc: schooldesc,
            longitude: longitude,
            latitude: latitude,
            soundurl,
            videourl,areaid,parentid,
            createbyuserid: userinfo[0].sysUserID
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