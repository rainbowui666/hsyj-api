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
      // const homedata = await this.cache('home_activity_scenery');
      // if (!think.isEmpty(homedata)) {
      //   console.log('redis found data ...')
      //   return this.success(homedata)
      // }
      // 活动推荐
      const model = _this2.model('activity');
      model._pk = 'activityID';
      const studentid = _this2.get('studentid');
      const data = yield model.field(['activityID', 'activityName', 'startDate', 'endDate', 'isGroup']).where({ isrecommend: 1, shstate: 0 }).order('activityID desc').limit(0, 5).select();

      const arrdata = [];
      for (const item of data) {
        item.pics = yield _this2.model('activity').getPicsbyid(item.activityID);
        item.joinnum = yield _this2.model('student_activity').getJoinNum(item.activityID);
        if (!think.isEmpty(studentid)) {
          let joindate = yield _this2.model('student_activity').getStudentIsJoinActivity(studentid, item.activityID);
          let start = Number(new Date(item.startDate));
          let nowd = Number(new Date());
          let end = Number(new Date(item.endDate));

          if (nowd > end && joindate && joindate.length > 0) {
            item.hasjoin = '已完成';
          } else if (joindate && joindate.length > 0) {
            item.hasjoin = '已报名';
          } else if (start < nowd && nowd < end) {
            item.hasjoin = '进行中';
          }
        } else {
          let start = Number(new Date(item.startDate));
          let nowd = Number(new Date());
          let end = Number(new Date(item.endDate));

          if (start < nowd && nowd < end) {
            item.hasjoin = '进行中';
          } else if (end < nowd) {
            item.hasjoin = '已完成';
          } else {
            item.hasjoin = '未开始';
          }
        }

        arrdata.push(item);
      }

      // 景点推荐
      const model2 = _this2.model('scenery');
      model2._pk = 'sceneryID';
      const data2 = yield model2.field(['sceneryID', 'sceneryTitle', 'schoolid']).where({ isrecommend: 1, shstate: 0 }).order('sceneryID desc').limit(0, 5).select();

      const arrdata2 = [];
      for (const item of data2) {
        item.pics = yield _this2.model('scenery').getPicsbyid(item.sceneryID);
        item.joinnum = yield _this2.model('student_scenery').getJoinNum(item.sceneryID);
        item.schoolName = yield _this2.model('school').field(['schoolName']).where({ schoolID: item.schoolid }).getField('schoolName', true);
        arrdata2.push(item);
      }

      // console.log('write...')
      let alldata = { activitydata: arrdata, scenerydata: arrdata2
        // await this.cache('home_activity_scenery', alldata, 'redis')
      };return _this2.success(alldata);
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