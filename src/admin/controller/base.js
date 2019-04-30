module.exports = class extends think.Controller {
    async __before() {
      // 根据token值获取用户id
      this.ctx.state.token = this.ctx.header['x-hsyj-token'] || '';
      const tokenSerivce = think.service('token', 'admin');
      // const data = await this.cache('userinfo');
      // if (think.isEmpty(data)) {
      //   return this.fail(401, '请先登录');
      // }
      // if (this.ctx.state.token != data[0].token) {
      //   return this.fail(401, 'token已失效，请重新登录');
      // }
      // this.ctx.state.userId = data[0].sysUserID; //await tokenSerivce.getUserId(this.ctx.state.token);
      // console.log('ctx.state.userId', this.ctx.state.userId, this.ctx.state.token, data[0].token)
      // 只允许登录操作
      if (this.ctx.controller !== 'auth') {
        // console.log('', this.ctx.controller,this.ctx.state.userId)
        if (this.ctx.state.userId <= 0) {
          return this.fail(401, '请先登录');
        }
      }
    }
  };
  