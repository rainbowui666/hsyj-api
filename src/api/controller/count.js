const Base = require('./base.js');

module.exports = class extends Base {
    async getHotMapDataAction() {
        const id = this.get('id');
        const scencerys = await this.model("activity_scenery").field('sceneryid').where({activityid:id}).select();
        // const sql = `select sceneryid,count(1) num from culture_student_scenery where sceneryid in (${scencerys.join(",")}) to_days(createdate) = to_days(now()) group by sceneryid`;

        const sql = `select sceneryid,count(1) num from culture_student_scenery  group by sceneryid`
        const counts = await this.model('student_scenery').query(sql);
        const scencry = await this.model('scenery').where({sceneryID:scencerys[0].sceneryid}).find();
        const hotdata = {
            data:[],
            lng:scencry.longitude,
            lat:scencry.latitude
        }
        for(const count of counts){
            const scencry = await this.model('scenery').where({sceneryID:count.sceneryid}).find();
            if(scencry&&scencry.longitude){
                hotdata.data.push(
                    {
                        lng:Number(scencry.longitude),
                        lat:Number(scencry.latitude),
                        count:count.num
                    }
                )
            }
            
        }
        return this.json(hotdata);

    }
}