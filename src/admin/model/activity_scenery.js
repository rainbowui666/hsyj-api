const _ = require('lodash');

module.exports = class extends think.Model {
    async getsceneryrangebyid(id) {
        const data = await this.model('activity_scenery').distinct('sceneryid').field(['sceneryid']).where({activityid:id}).select();
        if (!think.isEmpty(data)) {
            for (const item of data) {
                item.sceneryname = await this.getname(item.sceneryid);
            }
        }
        return data;
    }

    async getname(id) {
        const data =  await this.model('scenery').field(['sceneryTitle']).where({sceneryID: id}).find();
        if (!think.isEmpty(data)) {
            return data.sceneryTitle;
        }
        return '';
    }
}