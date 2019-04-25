function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const User = yield _this.model('User').select();

      // const data = await this.cache('rds_user');
      // console.log(data)
      return _this.success({
        User: User
      });
    })();
  }

  homeAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {

      // await this.cache('home_activity_scenery', null)
      // await this.cache('home_activity_scenery', null, 'redis')
      const homedata = yield _this2.cache('home_activity_scenery');
      if (!think.isEmpty(homedata)) {
        console.log('redis found data ...');
        return _this2.success(homedata);
      }
      // 活动推荐
      const model = _this2.model('activity');
      model._pk = 'activityID';
      const data = yield model.field(['activityID', 'activityName']).order('activityID desc').limit(0, 5).select();

      const arrdata = [];
      for (const item of data) {
        item.pics = yield _this2.model('activity').getPicsbyid(item.activityID);
        item.joinnum = yield _this2.model('student_activity').getJoinNum(item.activityID);
        arrdata.push(item);
      }

      // 景点推荐
      const model2 = _this2.model('scenery');
      model2._pk = 'sceneryID';
      const data2 = yield model2.field(['sceneryID', 'sceneryTitle']).order('sceneryID desc').limit(0, 5).select();

      const arrdata2 = [];
      for (const item of data2) {
        item.pics = yield _this2.model('scenery').getPicsbyid(item.sceneryID);
        item.joinnum = yield _this2.model('student_scenery').getJoinNum(item.sceneryID);
        arrdata2.push(item);
      }

      console.log('write...');
      let alldata = { activitydata: arrdata, scenerydata: arrdata2 };
      yield _this2.cache('home_activity_scenery', alldata, 'redis');
      return _this2.success(alldata);
    })();
  }

  getIndexDataAction() {
    // let rdsoption = {auth_pass:'000000'}

    // var client = redis.createClient(6379,'127.0.0.1', rdsoption);

    // client.auth('000000',function(){
    //   console.log('pass......')
    // })
    // client.set('hello',"{aa:'bb',dd:'1234'}");

    // client.get('hello',function (err,v) {
    //     console.log("redis get hello err,v",err,v);
    // })

    return _asyncToGenerator(function* () {})();
  }
};
//# sourceMappingURL=index.js.map