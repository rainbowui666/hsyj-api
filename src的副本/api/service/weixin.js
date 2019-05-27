const crypto = require('crypto');
const md5 = require('md5');
const rp = require('request-promise');

module.exports = class extends think.Service {
    async login(code, fullUserInfo) {
        try {
          // 获取 session
          const options = {
            method: 'GET',
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            qs: {
              grant_type: 'authorization_code',
              js_code: code,
              secret: think.config('weixin.secret'),
              appid: think.config('weixin.appid')
            }
          };
    
          let sessionData = await rp(options);
          sessionData = JSON.parse(sessionData);
          if (!sessionData.openid) {
            return null;
          }
    
          // 验证用户信息完整性
          const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData.toString() + sessionData.session_key).digest('hex');
          if (fullUserInfo.signature !== sha1) {
            return null;
          }
    
          // 解析用户数据
          const wechatUserInfo = await this.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
          if (think.isEmpty(wechatUserInfo)) {
            return null;
          }
          return wechatUserInfo;
        } catch (e) {
            console.log('weixin.login err', e)
          return null;
        }
      }
}