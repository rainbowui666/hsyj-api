const Base = require('./base.js');

module.exports = class extends Base {
    async deleteAction() {
        const id = this.get('id');
        const data = {
            shstate: 1
        }
        await this.model('scenery').where({sceneryID:id}).update(data);
        // await this.cache('home_activity_scenery', null, 'redis');
        return this.success('删除成功')
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
        const isrecommend = this.post('isrecommend');
        const id = this.get('id');

        let param = {
            sceneryTitle: sceneryTitle,
            schoolid: schoolid,
            address: address,
            shdesc: shdesc,
            longitude: longitude,
            latitude: latitude,
            soundurl,
            videourl,
            isrecommend
        }; 
        await this.model('pagecache').getdatabyname('home_discuss');
        if (think.isEmpty(id)) {
            let model = this.model('scenery');
            const insertid = await model.add(param);
            // await this.cache('home_activity_scenery', null, 'redis');
            // 上传景点图片
            if (insertid) {
                return this.json({
                        insertid:insertid
                    });
            }
        } else {
            // await this.cache('home_activity_scenery', null, 'redis');
            // 1 删除source, 2修改
            await this.model('source').where({targetid:id}).delete();
            await this.model('scenery').where({sceneryID:id}).update(param);
            return this.success('景点修改成功')
        }
        
    }
}