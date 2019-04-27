module.exports = class extends think.Model {
    async getdatabyname(name) {
        const model = this.model('pagecache');
        model._pk = 'cacheid';
        const data = await model.where({cachename:['like','%'+name+'%']}).delete();
        return data;
    }
}