function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
var svgCaptcha = require('svg-captcha');
var http = require('http');

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

  createCaptchaAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      var captcha = svgCaptcha.create({
        // 翻转颜色  
        inverse: false,
        // 字体大小  
        fontSize: 36,
        // 噪声线条数  
        noise: 2,
        // 宽度  
        width: 80,
        // 高度  
        height: 30
      });
      // 保存到session,忽略大小写  
      _this3.ctx.req.session = captcha.text.toLowerCase();
      console.log(_this3.ctx.req.session); //0xtg 生成的验证码
      //保存到cookie 方便前端调用验证
      _this3.cache('captcha', _this3.ctx.req.session);
      _this3.ctx.type = 'image/svg+xml';
      _this3.ctx.res.write(String(captcha.data));
      _this3.ctx.res.end();
    })();
  }

};
//# sourceMappingURL=auth.js.map