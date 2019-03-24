const Base = require('./base.js');

module.exports = class extends Base {
    async addAction() {
        const sourcetype = this.post('sourcetype');
        const insertid = this.post('insertid');
        const sourceaddress = this.post('sourceaddress');
        
        const insertid2 = await this.model('source').add({
            sourceType:sourcetype,
            sourceAddress: sourceaddress,
            targetid: insertid
        });

        if (insertid2) {
            return this.success('学校添加成功')
        }
    }
}