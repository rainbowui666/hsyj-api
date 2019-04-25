const Base = require('./base.js');

module.exports = class extends Base {
    
    async getUserListBySchoolidAction() {
        const schoolid = this.get('schoolid');
        const data = await this.model('User').where({schoolid:schoolid}).select();
        return this.success(data)
    }
}