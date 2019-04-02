const _ = require('lodash');

module.exports = class extends think.Model {
    async getDiscussById(id,distype) {
        const model = this.model('discuss');
        model._pk = 'discussID';
        const data = await model.where({distype:distype,targetid:id,shstate:1}).select();
        return data;
    }
}