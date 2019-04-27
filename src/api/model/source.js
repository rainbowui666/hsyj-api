const _ = require('lodash');

module.exports = class extends think.Model {
    async getSourceById(id,distype) {
        const model = this.model('source');
        model._pk = 'sourceID';
        const data = await model.where({sourceType:distype,sourceID:id,shstate:1}).select();
        return data;
    }
}