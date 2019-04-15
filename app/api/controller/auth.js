function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
var svgCaptcha = require('svg-captcha');
const cookieParase = require('cookie-parser');
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

  getUserInfoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const sysuserid = _this2.get('sysuserid');
      const data = yield _this2.model('User').where({ sysUserID: sysuserid }).find();
      return _this2.success(data);
    })();
  }
  logoutAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3.success();
    })();
  }

  createCaptchaAction() {
    var _this4 = this;

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
      _this4.ctx.req.session = captcha.text.toLowerCase();
      console.log(_this4.ctx.req.session); //0xtg 生成的验证码
      //保存到cookie 方便前端调用验证
      _this4.cache('captcha', _this4.ctx.req.session);
      _this4.ctx.type = 'image/svg+xml';
      _this4.ctx.res.write(String(captcha.data));
      _this4.ctx.res.end();
    })();
  }
  adminLoginAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const captchacode = _this5.post('captchacode');
      const authcaptha = yield _this5.cache('captcha');
      if (think.isEmpty(captchacode)) {
        return _this5.fail('验证码为空');
      }

      if (captchacode != authcaptha) {
        console.log('fail', captchacode, authcaptha);
        return _this5.fail('验证码错误');
      }

      const username = _this5.post('username');
      const pwd = _this5.post('pwd');
      const data = yield _this5.model('User').where({ userName: username, pwd: pwd }).find();
      if (think.isEmpty(data)) {
        return _this5.fail(403, '账号或密码错误');
      }
      const id = data.sysUserID;

      const model = _this5.model('User');
      // let userData = await model.query("select u.*,ur.roleid,r.roleName,rp.permissionid,p.permissionName,ps.schoolid from culture_user u inner join culture_user_role ur on u.sysUserID=ur.sysuserid inner join culture_role r on r.roleID=ur.roleid inner join culture_role_permission rp on rp.roleid=r.roleID inner join culture_permission p on p.permissionID=rp.permissionid inner join culture_permission_school ps on ps.permissionid=p.permissionID where u.sysuserid="+id);
      let userData = yield model.query("select u.*,s.schoolName from culture_User u left join culture_school s on u.schoolid=s.schoolID where u.sysuserid=" + id);

      const TokenSerivce = _this5.service('token', 'api');
      const sessionKey = yield TokenSerivce.create({ user_id: userData.sysUserID });

      if (think.isEmpty(userData) || think.isEmpty(sessionKey)) {
        return _this5.fail('登录失败');
      }
      userData[0].token = sessionKey;
      _this5.cache('userinfo', userData);
      // console.log(userData)
      // return this.success({ token: sessionKey, userInfo: newUserInfo });

      return _this5.success({ userData });
    })();
  }

  adminLogoutAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      _this6.cache('userinfo', null);
      return _this6.success('成功退出登录');
    })();
  }
};
//# sourceMappingURL=auth.js.map