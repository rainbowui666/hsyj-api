module.exports = class extends think.Controller {
  async __before() {
    // 根据token值获取用户id
    this.ctx.state.token = this.ctx.header['sms-token'] || '';
    console.log('api.token', this.ctx.state.token)
    const tokenSerivce = think.service('token', 'api');
    this.ctx.state.userId = await tokenSerivce.getUserId(this.ctx.state.token);
    // this.ctx.state.userinfo = await tokenSerivce.getUser(this.ctx.state.token);
    // console.log('userid------', this.ctx.state.userId, this.ctx.state.userinfo)
    // const publicController = this.config('publicController');
    // const publicAction = this.config('publicAction');
    // 如果为非公开，则验证用户是否登录
    // const controllerAction = this.ctx.controller + '/' + this.ctx.action;
    // if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
      // if (this.ctx.state.userId <= 0) {
      //   return this.fail(401, '请先登录');
      // }
    // }
  }

  /**
   * 获取时间戳
   * @returns {Number}
   */
  getTime() {
    return parseInt(Date.now() / 1000);
  }

  /**
   * 获取当前登录用户的id
   * @returns {*}
   */
  getLoginUserId() {
    return this.ctx.state;
  }

  uncodeUtf16(str){
    var reg = /\&#.*?;/g;
    var result = str.replace(reg,function(char){
        var H,L,code;
        if(char.length == 9 ){
            code = parseInt(char.match(/[0-9]+/g));
            H = Math.floor((code-0x10000) / 0x400)+0xD800;
            L = (code - 0x10000) % 0x400 + 0xDC00;
            return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
        }else{
            return char;
        }
    });
    return result;
 }

utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g;
    // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0);
            // 取出高位
            L = char.charCodeAt(1);
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}
};
