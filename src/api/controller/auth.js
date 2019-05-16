const Base = require('./base.js');
var svgCaptcha = require('svg-captcha');
var http = require('http');
const rp = require('request-promise');

module.exports = class extends Base {
  async loginAction() {
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        grant_type: 'authorization_code',
        js_code: this.post('code'),
        secret: 'b92e07c57496470c7c961e4f4dbccfcc',
        appid: 'wx57b35c6b53e20d2d'
      }
    };

    let sessionData = await rp(options);
    const userObj = JSON.parse(sessionData);

    console.log('userObj', userObj)
  
    //根据openid 去数据库查询
    let user = await this.model('student').where({wxopenid:userObj.openid}).find();
    if(think.isEmpty(user)){
      let avatarUrl = this.post('avatarUrl');
      let gender = this.post('gender') == 1 ? 0 : 1;
      let nickName = this.post('nickName');

        let userId = await this.model('student').add({
                studentName: '微信用户' + nickName,
                photo: avatarUrl,
                sex: gender,
                nickname: nickName,
                wxopenid: userObj.openid
              });
    }

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: user.studentID });

    // console.log(sessionKey, user)
    //获得token
    // return this.json({token,user})
    // if (think.isEmpty(user) || think.isEmpty(sessionKey)) {
    //   return this.fail('登录失败');
    // }

    return this.success({ token: sessionKey, userInfo: user });
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


};
