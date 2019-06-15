module.exports = class extends think.Model {
    async getdatabyname(name) {
        const model = this.model('pagecache');
        model._pk = 'cacheid';
        const dataname = await model.where({cachename:['like','%'+name+'%']}).select();
        
        if (!think.isEmpty(dataname)) {
            for (let i = 0; i < dataname.length; i++) {
                let name = dataname[i].cachename;
                await this.cache(name, null);
            }
        }
        const data = await model.where({cachename:['like','%'+name+'%']}).delete();
        return data;
    }

    async getUserInfo(token, userId) {
        // console.log('getUserInfo', token, userId)
        let data = null;
        if (userId != 0) {
            data = await this.model('user').where({sysUserID: userId}).find();
        } else {
            data = await this.cache('userinfo'+ token);
        }
        return data;
    }
}