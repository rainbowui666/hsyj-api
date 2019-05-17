function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
var svgCaptcha = require('svg-captcha');
var http = require('http');
const rp = require('request-promise');

module.exports = class extends Base {
  loginAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const options = {
        method: 'GET',
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
          grant_type: 'authorization_code',
          js_code: _this.post('code'),
          secret: 'b92e07c57496470c7c961e4f4dbccfcc',
          appid: 'wx57b35c6b53e20d2d'
        }
      };

      let sessionData = yield rp(options);
      const userObj = JSON.parse(sessionData);

      console.log('userObj', userObj);

      //根据openid 去数据库查询
      let user = yield _this.model('student').where({ wxopenid: userObj.openid }).find();
      if (think.isEmpty(user)) {
        let avatarUrl = _this.post('avatarUrl');
        let gender = _this.post('gender') == 1 ? 0 : 1;
        let nickName = _this.post('nickName');

        let userId = yield _this.model('student').add({
          studentName: '微信用户' + nickName,
          photo: avatarUrl,
          sex: gender,
          nickname: nickName,
          wxopenid: userObj.openid
        });
      }

      const newUserInfo = yield _this.model('student').where({ wxopenid: userObj.openid }).find();

      const TokenSerivce = _this.service('token', 'api');
      const sessionKey = yield TokenSerivce.create({ user_id: newUserInfo.studentID });

      // console.log(sessionKey, user)
      //获得token
      // return this.json({token,user})
      // if (think.isEmpty(user) || think.isEmpty(sessionKey)) {
      //   return this.fail('登录失败');
      // }

      return _this.success({ token: sessionKey, userInfo: newUserInfo });
    })();
  }

  // async loginAction() {
  //   const code = this.post('code');
  //   const fullUserInfo = this.post('userInfo');
  //   const tel = this.post('tel');
  //   const schoolid = this.post('schoolid');
  //   const studentname = this.post('studentname');
  //   const stuNo = this.post('stuno');

  //   // 解释用户数据 code 061i3zz12Z3K4V0CbVz126boz12i3zzK
  //   // const userInfo = await this.service('weixin', 'api').login(code, fullUserInfo);
  //   // if (think.isEmpty(userInfo)) {
  //   //   return this.fail('登录失败');
  //   // } 

  //   // 根据openid查找用户是否已经注册
  //   // let userId = await this.model('student').where({ wxopenid: userInfo.openId }).getField('studentId', true);
  //   // if (think.isEmpty(userId)) {
  //     // 注册
  //   //   userId = await this.model('user').add({
  //   //     username: '微信用户' + think.uuid(6),
  //   //     pwd: '',
  //   //     tel: '',
  //   //     wxopenid: userInfo.openId,
  //   //     photo: userInfo.avatarUrl || '',
  //   //     sex: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
  //   //     nickname: userInfo.nickName
  //   //   });
  //   // }

  //   // 查询用户信息
  //   const newUserInfo = await this.model('student').where({ tel:tel, schoolid:schoolid,studentName:studentname, stuNo:stuNo }).find();

  //   const TokenSerivce = this.service('token', 'api');
  //   const sessionKey = await TokenSerivce.create({ user_id: newUserInfo.studentID });

  //   if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
  //     return this.fail('登录失败');
  //   }

  //   return this.success({ token: sessionKey, userInfo: newUserInfo });
  // }


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