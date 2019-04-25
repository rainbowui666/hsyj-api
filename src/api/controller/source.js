const Base = require('./base.js');

module.exports = class extends Base {

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