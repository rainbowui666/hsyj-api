const _ = require('lodash');

module.exports = class extends think.Model {
    async getPicsbyid(id) {
        const data = await this.model('source').where({sourceType: 1, targetid: id}).select();
        return data;
    }
   
    
    async getstate(id) {
        const model = this.model('student_scenery');
        model._pk = 'sceneryid';
        // const checkin = await model.where({sceneryid: id, shstate: 1}).count('sceneryid');
        const wantto = await model.where({sceneryid: id, shstate: 0}).count('sceneryid');
        // const sharenum = await model.where({sceneryid: id, shstate: 4}).count('sceneryid');

        const modeldis = this.model('discuss');
        modeldis._pk = 'discussID';
        const disnum = await modeldis.where({distype: 0, targetid: id, shstate: 1}).count('discussID');
        return {
            // checkin: checkin,
            wantto: wantto,
            // sharenum: sharenum,
            disnum: disnum
        }
    }

    async getTopScenery() {
        const activitys = await this.query('select sceneryid,count(sceneryid) num  from culture_attention_activity group by sceneryid order by num desc limit 5');
        const topActive = [];
        
        
        for(const activity of activitys ){
            const name = await this.model('scenery').where({sceneryID:activity.sceneryid}).find();
            topActive.push({
                name:name.sceneryTitle,
                num:activity.num
            })
        }

       

        const jactivitys = await this.query('select sceneryid,count(sceneryid) num  from culture_student_scenery group by sceneryid order by num desc limit 5');
        const jtopActive = [];
        
        
        for(const activity of jactivitys ){
            const name = await this.model('scenery').where({sceneryID:activity.sceneryid}).find();
            jtopActive.push({
                name:name.sceneryTitle,
                num:activity.num
            })
        }


        _.each(topActive,(active)=>{
            const a = _.find(jtopActive,(ja)=>{
                return ja.name == active.name
            });
            if(a){
                active.num = active.num+a.num;
            }
        });

        var compare = function(obj1,obj2){
                var val1 = obj1.num;
                var val2 = obj2.num;
                if(val1 < val2){
                   return 1;
                }else if(val1 > val2){
                   return -1;
                }else{
                   return 0;
                }
            }
       
        topActive.sort(compare);


        return topActive;
    }
    async getManagerTopScenery(id) {
        const activitys = await this.query('select sceneryid,count(sceneryid) num  from culture_attention_activity where sceneryid in (select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+')) group by sceneryid order by num desc limit 5');
        const topActive = [];

        for(const activity of activitys ){
            const name = await this.model('scenery').where({sceneryID:activity.sceneryid}).find();
            topActive.push({
                name:name.sceneryTitle,
                num:activity.num
            })
        }

        const jactivitys = await this.query('select sceneryid,count(sceneryid) num  from culture_student_scenery where sceneryid in (select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+')) group by sceneryid order by num desc limit 5');
        const jtopActive = [];

        for(const activity of jactivitys ){
            const name = await this.model('scenery').where({sceneryID:activity.sceneryid}).find();
            jtopActive.push({
                name:name.sceneryTitle,
                num:activity.num
            })
        }

        _.each(topActive,(active)=>{
            const a = _.find(jtopActive,(ja)=>{
                return ja.name == active.name
            });
            if(a){
                active.num = active.num+a.num;
            }
        });

        var compare = function(obj1,obj2){
                var val1 = obj1.num;
                var val2 = obj2.num;
                if(val1 < val2){
                   return 1;
                }else if(val1 > val2){
                   return -1;
                }else{
                   return 0;
                }
            }
       
        topActive.sort(compare);



        return topActive;
    }

    async getTopSignScenery() {
        const schoolds = await this.query('select schoolId,schoolName from culture_school where parentid>0');
        const topActive = [];
        for(const s of schoolds){
            const nums = await this.query("select count(DISTINCT studentid,sceneryid,activityid) num from culture_attention_activity where activityid in (select activityID from culture_activity where  needSchoolRang like '%"+s.schoolId+"%')");
            topActive.push({
                            name:s.schoolName,
                            num:nums[0].num
            })
        }

        const jtopActive = [];
        for(const s of schoolds){
            const nums = await this.query("select count(DISTINCT studentid,sceneryid) num  from culture_student_scenery where sceneryid in  (select sceneryid from culture_activity_scenery where activityid in (select activityID from culture_activity where  needSchoolRang like '%"+s.schoolId+"%'))");
            jtopActive.push({
                            name:s.schoolName,
                            num:nums[0].num
            })
        }

        _.each(topActive,(active)=>{
            const a = _.find(jtopActive,(ja)=>{
                return ja.name == active.name
            });
            if(a){
                active.num = active.num+a.num;
            }
        });



        var compare = function(obj1,obj2){
                var val1 = obj1.num;
                var val2 = obj2.num;
                if(val1 < val2){
                   return 1;
                }else if(val1 > val2){
                   return -1;
                }else{
                   return 0;
                }
            }
        var sortArr = topActive.sort(compare);
        if(sortArr.length>5){
            return sortArr.slice(4);
        }else{
            return sortArr
        }
    }
    async getTopManagerSignScenery(id) {
        const schoolds = await this.query('select schoolId,schoolName from culture_school where parentid='+id+'');
        const topActive = [];
        for(const s of schoolds){
            const nums = await this.query("select count(DISTINCT studentid,sceneryid,activityid) num from culture_attention_activity where activityid in (select activityID from culture_activity where  needSchoolRang like '%"+s.schoolId+"%')");
            topActive.push({
                            name:s.schoolName,
                            num:nums[0].num
            })
        }
        const jtopActive = [];
        for(const s of schoolds){
            const nums = await this.query("select count(sceneryid) num  from culture_student_scenery where sceneryid in  (select sceneryid from culture_activity_scenery where activityid in (select activityID from culture_activity where  needSchoolRang like '%"+s.schoolId+"%'))");
            jtopActive.push({
                            name:s.schoolName,
                            num:nums[0].num
            })
        }

        _.each(topActive,(active)=>{
            const a = _.find(jtopActive,(ja)=>{
                return ja.name == active.name
            });
            if(a){
                active.num = active.num+a.num;
            }
        });

        var compare = function(obj1,obj2){
                var val1 = obj1.num;
                var val2 = obj2.num;
                if(val1 < val2){
                   return 1;
                }else if(val1 > val2){
                   return -1;
                }else{
                   return 0;
                }
            }
        var sortArr = topActive.sort(compare);
      
        if(sortArr.length>5){
            return sortArr.slice(4);
        }else{
            return sortArr
        }
    }

    async getTourist(id) {
        const num1s = await this.query('select distinct studentid   from culture_discuss where targetid in ( select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+'))');
        const num2s = await this.query('select distinct studentid   from culture_student_scenery where sceneryid in ( select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+'))');

        const set = new Set();
        if(num1s&&num1s.length>0){
            for(const n1 of num1s){
                set.add(n1)
            }
        }

        if(num2s&&num2s.length>0){
            for(const n1 of num2s){
                set.add(n1)
            }
        }

        return set.size;
    }

    async getDiscuss(id) {
        const num1 = await this.query('select count(1) count from culture_discuss where targetid in ( select sceneryID from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+'))');
        const num2 = await this.query('select count(1) count from culture_discuss where targetid in ( select activityID from culture_activity where createbyschoolid='+id+')');
        return num1[0].count+num2[0].count;
    }

    async getScenery(id) {
        const num1 = await this.query('select count(1) count from culture_scenery where schoolid in (select schoolId from culture_school where parentid='+id+')');
        return num1[0].count;
    }
}
