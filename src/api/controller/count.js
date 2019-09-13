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
        const sql = `select sceneryid,count(1) num from culture_attention_activity where activityid=${id} group by sceneryid`;

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
        // this.trunString(scenerys);
        return this.json(scenerys)
    }

    async getTopGroupAction() {
        const id = this.get('id');
        const groups =  await this.model('group').where({activityid:id}).select()||[];
        const returnGroup = [];
        for(const group of groups){
            const students =  await this.model('student_group').where({groupid:group.groupid}).select()||[];
            let times = 0;
            let nums = 0;
            let owerNum = 0;
            for(const student of students){
                const sums =  await this.model('scenery').getTopGroupStudent(student.studentid,id);
                times += sums[0]?sums[0].time:0;
                nums += sums[0]?sums[0].num:0;
                if(group.studentid===student.studentid){
                    owerNum = sums[0]?sums[0].num:0;
                }
            }
            const scs =  await this.model('activity_scenery').where({activityid:id}).select()||[];
            returnGroup.push({
                name:group.groupName,
                times,
                num:nums,
                isDone:owerNum>=scs.length
            })
        }

        var compare = function(obj1,obj2){
                var val1 = obj1.times;
                var val2 = obj2.times;
                var val3 = obj1.nums;
                var val4 = obj2.nums;
                if(val1 < val2){
                   return 1;
                }else if(val1 > val2){
                   return -1;
                }else{
                   if(val3 < val4){
                           return 1;
                    }else if(val3 > val4){
                           return -1;
                    }else{
                           return 0;
                    }
                }
        }
       
        returnGroup.sort(compare);

        return this.json(returnGroup)
        
    }

    trunString(arrs){
        _.each(arrs,(arr)=>{
            if(arr.name){
                arr.name = arr.name.substring(0,5);
            }
        });
    }
}