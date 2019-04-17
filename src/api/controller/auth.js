const Base = require('./base.js');
var svgCaptcha = require('svg-captcha');
var http = require('http');

module.exports = class extends Base {
  async loginAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const tel = this.post('tel');
    const schoolid = this.post('schoolid');
    const studentname = this.post('studentname');
    const stuNo = this.post('stuno');

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
    const newUserInfo = await this.model('student').where({ tel:tel, schoolid:schoolid,studentName:studentname, stuNo:stuNo }).find();

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: newUserInfo.studentID });

    if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }

  async getUserInfoAction() {
    const sysuserid = this.get('sysuserid');
    const data = await this.model('User').where({sysUserID:sysuserid}).find()
    return this.success(data);
  }
  async logoutAction() {
    return this.success();
  }

  async createCaptchaAction() {
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
      height: 30,  
    });  
    // 保存到session,忽略大小写  
    this.ctx.req.session = captcha.text.toLowerCase(); 
    console.log(this.ctx.req.session); //0xtg 生成的验证码
    //保存到cookie 方便前端调用验证
    this.cache('captcha', this.ctx.req.session); 
    this.ctx.type = ('image/svg+xml');
    this.ctx.res.write(String(captcha.data));
    this.ctx.res.end();
  }

  async adminLoginAction() {
    const captchacode = this.post('captchacode');
    const authcaptha = await this.cache('captcha');
    console.log('adminLogin', captchacode, authcaptha)
    if (think.isEmpty(captchacode)) {
      return this.fail('验证码为空')
    }

    if (captchacode != authcaptha) {
      console.log('fail', captchacode, authcaptha)
      return this.fail('验证码错误')
    }

    const username = this.post('username');
    const pwd = this.post('pwd');
    const data = await this.model('User').where({userName:username, pwd:pwd}).find();
    if (think.isEmpty(data)) {
      return this.fail(403, '账号或密码错误');
    } 
      const id = data.sysUserID;

      const model = this.model('User');
      // let userData = await model.query("select u.*,ur.roleid,r.roleName,rp.permissionid,p.permissionName,ps.schoolid from culture_user u inner join culture_user_role ur on u.sysUserID=ur.sysuserid inner join culture_role r on r.roleID=ur.roleid inner join culture_role_permission rp on rp.roleid=r.roleID inner join culture_permission p on p.permissionID=rp.permissionid inner join culture_permission_school ps on ps.permissionid=p.permissionID where u.sysuserid="+id);
      let userData = await model.query("select u.*,s.schoolName from culture_User u left join culture_school s on u.schoolid=s.schoolID where u.sysuserid="+id);

      const TokenSerivce = this.service('token', 'api');
      const sessionKey = await TokenSerivce.create({ user_id: userData.sysUserID });

      if (think.isEmpty(userData) || think.isEmpty(sessionKey)) {
        return this.fail('登录失败');
      }
      userData[0].token = sessionKey;
      this.cache('userinfo', userData)
     // console.log(userData)
    // return this.success({ token: sessionKey, userInfo: newUserInfo });

    return this.success({userData})
  }

  async adminLogoutAction() {
    this.cache('userinfo', null);
    return this.success('成功退出登录');
  }
};
