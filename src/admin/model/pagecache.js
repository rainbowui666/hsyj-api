module.exports = class extends think.Model {
    async getdatabyname(name) {
        const model = this.model('pagecache');
        model._pk = 'cacheid';
        const dataname = await model.where({cachename:['like','%'+name+'%']}).select();
        // console.log(dataname)
        if (!think.isEmpty(dataname)) {
            for (let i = 0; i < dataname.length; i++) {
                let name = dataname[i].cachename;
                // console.log(name)
                await this.cache(name, null, 'redis');
            }
        }
        const data = await model.where({cachename:['like','%'+name+'%']}).delete();
        return data;
    }

    async getUserInfo(token, userId) {
        // console.log('getUserInfo', token, userId)
        let data = null;
        if (userId != 0) {
            data = await this.model('user').field(['schoolid','shstate','sysUserID','userName','usertype']).where({sysUserID: userId}).find();
        } else {
            data = await this.cache('userinfo'+ token);
        }
        return data;
    }
}