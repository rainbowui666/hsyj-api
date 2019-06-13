function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const jwt = require('jsonwebtoken');
const secret = 'SLDLKKDS323ssdd@#@@gfghje';

module.exports = class extends think.Service {
  /**
   * 根据header中的X-Nideshop-Token值获取用户id
   */
  getUser(token) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!token) {
        return null;
      }

      const result = yield _this.parse(token);
      console.log("================2=====", result);
      if (think.isEmpty(result) || result.user_id <= 0) {
        return null;
      }

      return result;
    })();
  }

  getUserId(token) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!token) {
        return 0;
      }

      const result = yield _this2.parse(token);
      if (think.isEmpty(result) || result.user_id <= 0) {
        return 0;
      }

      return result.user_id;
    })();
  }

  create(userInfo) {
    return _asyncToGenerator(function* () {
      const token = jwt.sign(JSON.stringify(userInfo), secret);
      return token;
    })();
  }

  parse(token) {
    return _asyncToGenerator(function* () {
      if (token) {
        try {
          return jwt.verify(token, secret);
        } catch (err) {
          return null;
        }
      }
      return null;
    })();
  }

  verify(token) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const result = yield _this3.parse(token);
      if (think.isEmpty(result)) {
        return false;
      }

      return true;
    })();
  }
};
//# sourceMappingURL=token.js.map