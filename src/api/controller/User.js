const Base = require('./base.js');

module.exports = class extends Base {
    
    async getUserListBySchoolidAction() {
        const schoolid = this.get('schoolid');
        const data = await this.model('user').where({schoolid:schoolid, shstate: 0}).select();
        return this.success(data)
    }
}