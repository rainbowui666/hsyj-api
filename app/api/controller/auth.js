function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  loginAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const code = _this.post('code');
      const fullUserInfo = _this.post('userInfo');
      const tel = _this.post('tel');
      const schoolid = _this.post('schoolid');
      const studentname = _this.post('studentname');
      const stuNo = _this.post('stuno');

      // 解释用户数据
      // const userInfo = await this.service('weixin', 'api').login(code, fullUserInfo);
      // if (think.isEmpty(userInfo)) {
      //   return this.fail('登录失败');
      // }

      // 根据openid查找用户是否已经注册
      // let userId = await this.model('student').where({ wxopenid: userInfo.openId }).getField('studentId', true);
      // if (think.isEmpty(userId)) {
      // 注册
      //   userId = await this.model('user').add({
      //     username: '微信用户' + think.uuid(6),
      //     pwd: '',
      //     tel: '',
      //     wxopenid: userInfo.openId,
      //     photo: userInfo.avatarUrl || '',
      //     sex: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
      //     nickname: userInfo.nickName
      //   });
      // }

      // 查询用户信息
      const newUserInfo = yield _this.model('student').where({ tel: tel, schoolid: schoolid, studentName: studentname, stuNo: stuNo }).find();

      const TokenSerivce = _this.service('token', 'api');
      const sessionKey = yield TokenSerivce.create({ user_id: newUserInfo.studentID });

      if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
        return _this.fail('登录失败');
      }

      return _this.success({ token: sessionKey, userInfo: newUserInfo });
    })();
  }

  logoutAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.success();
    })();
  }
};
//# sourceMappingURL=auth.js.map