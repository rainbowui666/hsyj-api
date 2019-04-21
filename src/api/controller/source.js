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

    async deleteAction(){
        const id = this.get('sourceid');
        const date = await this.model('source').where({sourceID:id}).delete();
        return this.success('删除成功')
    }

    async getListBytargetidAndSourceTypeAction(){
        const targetid = this.get('targetid');
        const sourcetype = this.get('sourcetype');
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 10;

        const model = this.model('source');
        model._pk = 'sourceID';

        let para = { };
        if (!think.isEmpty(targetid) && !think.isEmpty(sourcetype)) {
            para = {targetid:targetid, sourceType:sourcetype}
        } else if(!think.isEmpty(targetid)) {
            para = {targetid:targetid}
        } else {
            para = {sourceType:sourcetype}
        }
        const data = await model.where(para).page(pageindex, pagesize).countSelect();
        return this.success(data)
    }
}