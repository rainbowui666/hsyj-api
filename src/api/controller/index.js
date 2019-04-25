const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const User = await this.model('User').select();

  // const data = await this.cache('rds_user');
  // console.log(data)
    return this.success({
      User: User
    });
  }

  async homeAction() {

    // await this.cache('home_activity_scenery', null)
    // await this.cache('home_activity_scenery', null, 'redis')
    const homedata = await this.cache('home_activity_scenery');
    if (!think.isEmpty(homedata)) {
      console.log('redis found data ...')
      return this.success(homedata)
    }
    // 活动推荐
    const model = this.model('activity');
    model._pk = 'activityID';
    const data = await model.field(['activityID', 'activityName']).order('activityID desc').limit(0,5).select();
    
    const arrdata = [];
    for (const item of data) {
      item.pics = await this.model('activity').getPicsbyid(item.activityID);
      item.joinnum = await this.model('student_activity').getJoinNum(item.activityID);
      arrdata.push(item);
    }

    // 景点推荐
    const model2 = this.model('scenery');
    model2._pk = 'sceneryID';
    const data2 = await model2.field(['sceneryID', 'sceneryTitle']).order('sceneryID desc').limit(0,5).select();
    
    const arrdata2 = [];
    for (const item of data2) {
      item.pics = await this.model('scenery').getPicsbyid(item.sceneryID);
      item.joinnum = await this.model('student_scenery').getJoinNum(item.sceneryID);
      arrdata2.push(item);
    }

    console.log('write...')
    let alldata = {activitydata: arrdata, scenerydata: arrdata2}
    await this.cache('home_activity_scenery', alldata, 'redis')
    return this.success(alldata)
  }

  async getIndexDataAction(){
    // let rdsoption = {auth_pass:'000000'}

    // var client = redis.createClient(6379,'127.0.0.1', rdsoption);

    // client.auth('000000',function(){
    //   console.log('pass......')
    // })
    // client.set('hello',"{aa:'bb',dd:'1234'}");

    // client.get('hello',function (err,v) {
    //     console.log("redis get hello err,v",err,v);
    // })
  }
};
