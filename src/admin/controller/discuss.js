const Base = require('./base.js');

module.exports = class extends Base {
    async updateAction() {
        const id = this.get('id');
        const shstate = this.get('shstate');
        const data = {
            shstate
        }

        await this.model('discuss').where({discussID:id}).update(data);
        return this.success('修改成功')
    }
}