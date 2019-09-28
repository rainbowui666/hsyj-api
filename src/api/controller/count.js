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
    async getGroupMapDataAction() {
        const activityid = this.get('id');
        const studentId = this.get('studentId');
        // const groupId = this.get('groupId');
        const groupStudent = await this.model('student_group').where({studentid:studentId,activityid:activityid}).find();
        const scenerys = await this.model('activity_scenery').where({activityid}).order('sceneryid').select();
        const scenery = await this.model('scenery').where({sceneryID:scenerys[0].sceneryid}).find();
        if(think.isEmpty(groupStudent)){
            return this.json({center:scenery});
        }else{
            const ower = await this.model('group').where({groupid:groupStudent.groupid}).find();
            const returnList = await this.getGroupScenery(activityid,ower.studentid);
            return this.json({center:scenery,data:returnList,group:ower});
        }
        
    }

    async clickGroupMapDataAction() {
        const activityid = this.get('id');
        const groupId = this.get('groupId');
        const ower = await this.model('group').where({groupid:groupId}).find();
        const returnList = await this.getGroupScenery(activityid,ower.studentid);
        return this.json({data:returnList,group:ower});
    }

    async getGroupScenery(activityid,studentid){
        const list = await this.model('attention_activity').where({activityid,studentid}).order('createdate').select();
        const returnList = [];
        for(const item of list){
            const scenery = await this.model('scenery').where({sceneryID:item.sceneryid}).find();
            scenery.sigin = item;
            returnList.push(scenery)
        }
        return returnList;
    }

    async getTopGroupAction() {
        const id = this.get('id');
        const groups =  await this.model('group').where({activityid:id}).select()||[];
        const returnGroup = [];
        for(const group of groups){
            let times = 0;
            let fens = 0;
            let nums = 0;
            const sums =  await this.model('scenery').getTopGroupStudent(group.studentid,id);
            nums = sums[0].num;
            if(nums>0){
                const scs =  await this.model('activity_scenery').where({activityid:id}).select()||[];
                const isFinish = scs.length-nums;
                if(sums[0].time){
                    const finishTime = isFinish>0?new Date().getTime():new Date(sums[0].mtime).getTime()
                    const usedTime = finishTime-new Date(sums[0].time).getTime();
                    // var days=Math.floor(usedTime/(24*3600*1000));
                    // //计算出小时数
                    // var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
                    // var hours=Math.floor(leave1/(3600*1000));
                    // //计算相差分钟数
                    // var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
                    // var minutes=Math.floor(leave2/(60*1000));

                    // var leave3=leave1%(60*1000);        //计算小时数后剩余的毫秒数
                    // var second =Math.floor(leave3/(60*1000));
                    //计算出相差天数  
                    // var days=Math.floor(date3/(24*3600*1000))  
                
                    //计算出小时数  
                
                    var leave1=usedTime%(24*3600*1000)    //计算天数后剩余的毫秒数  
                    var hours=Math.floor(leave1/(3600*1000))  
                    //计算相差分钟数  
                    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
                    var minutes=Math.floor(leave2/(60*1000))  
                    //计算相差秒数  
                    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数  
                    var second=Math.round(leave3/1000)  
                    times = (hours>9?hours:'0'+hours)+':'+(minutes>9?minutes:'0'+minutes)+':'+(second>9?second:'0'+second)
                    fens = hours*60+minutes
                }else{
                    times = "00:00:00"
                } 
                returnGroup.push({
                    id:group.groupid,
                    name:group.groupName,
                    times,
                    fens,
                    num:nums,
                    isDone:isFinish
                })
            }
           
        }

        var compare = function(obj1,obj2){
                var val1 = obj1.num;
                var val2 = obj2.num;
                var val3 = obj1.times.split(':')[1];
                var val4 = obj2.times.split(':')[1];
                if(val1 < val2){
                   return 1;
                }else if(val1 > val2){
                   return -1;
                }else{
                   if(val3 < val4){
                           return -1;
                    }else if(val3 > val4){
                           return 1;
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