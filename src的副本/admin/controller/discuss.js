const Base = require('./base.js');

module.exports = class extends Base {
    async updateAction() {
        const id = this.get('id');
        const shstate = this.get('shstate');
        const isrecommend = this.get('isrecommend') || 0;
        const data = {
            shstate,isrecommend
        }

        // 查找缓存
        await this.model('pagecache').getdatabyname('home_discuss');

        await this.model('discuss').where({discussID:id}).update(data);
        return this.success('修改成功')
    }
}