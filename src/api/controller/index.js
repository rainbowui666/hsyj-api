const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const User = await this.model('User').select();

    return this.success({
      User: User
    });
  }
};
