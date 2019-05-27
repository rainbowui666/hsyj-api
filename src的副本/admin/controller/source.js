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

    async editAction() {
        const sourceid = this.post('sourceid');
        const sourcetype = this.post('sourcetye');
        const sourceaddress = this.post('sourceaddress');
        const targetid = this.post('targetid');
        const picdesc = this.post('picdesc') || '';

        const para = {
            sourceType:sourcetype,
            sourceAddress: sourceaddress,
            targetid:targetid,
            picdesc: picdesc
        }

        await this.model('source').where({sourceID: sourceid}).update(para);
        return this.success('修改成功')
    }
    
    async deleteAction(){
        const id = this.get('sourceid');
        const date = await this.model('source').where({sourceID:id}).delete();
        return this.success('删除成功')
    }
}