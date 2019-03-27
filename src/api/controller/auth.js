const Base = require('./base.js');

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

  async logoutAction() {
    return this.success();
  }
};
