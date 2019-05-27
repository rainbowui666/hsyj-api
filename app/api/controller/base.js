function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Controller {
  __before() {
    var _this = this;

    return _asyncToGenerator(function* () {
      // 根据token值获取用户id
      _this.ctx.state.token = _this.ctx.header['sms-token'] || '';
      const tokenSerivce = think.service('token', 'api');
      _this.ctx.state.userId = yield tokenSerivce.getUserId(_this.ctx.state.token);

      console.log('userid------', _this.ctx.state.userId);
      // const publicController = this.config('publicController');
      // const publicAction = this.config('publicAction');
      // 如果为非公开，则验证用户是否登录
      // const controllerAction = this.ctx.controller + '/' + this.ctx.action;
      // if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
      // if (this.ctx.state.userId <= 0) {
      //   return this.fail(401, '请先登录');
      // }
      // }
    })();
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
};
//# sourceMappingURL=base.js.map