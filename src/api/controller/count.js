const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    async getHotMapDataAction() {
        const id = this.get('id');
        // const scencerys = await this.model("activity_scenery").field(['sceneryid']).where({activityid:id}).select();
        // const ids = [];
        // _.each(scencerys,(s)=>{
        //     ids.push(s.sceneryid);
        // });
        // const sql = `select sceneryid,count(1) num from culture_student_scenery where sceneryid in (${ids.join(",")}) and to_days('createdate') = to_days(now()) group by sceneryid`;
        const sql = `select sceneryid,count(1) num from culture_student_scenery where activityid=${id} group by sceneryid`;

        // const sql = `select sceneryid,count(1) num from culture_student_scenery  group by sceneryid`
        const counts = await this.model('student_scenery').query(sql);
        const where = counts[0]?{sceneryID:counts[0].sceneryid}:{sceneryID:0}
        const scencry = await this.model('scenery').where(where).find();
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

    async getTopSceneryAction() {
        const id = this.get('id');
        const scenerys =  await this.model('scenery').getTopScenery(id);
        this.trunString(scenerys);
        return this.json(scenerys)
    }

    trunString(arrs){
        _.each(arrs,(arr)=>{
            if(arr.name){
                arr.name = arr.name.substring(0,5);
            }
        });
    }
}