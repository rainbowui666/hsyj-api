const Base = require('./base.js');

module.exports = class extends Base {
    async indexAction() {
        const page = this.get('pageindex') || 1;
        const size = this.get('pagesize') || 10;
        const schoolname = this.get('schoolname') || '';
        const areaid = this.get('areaid') || '';
        let userinfo = await this.cache('userinfo');
        if (think.isEmpty(userinfo)) {
            return this.field('请先登录')
        }

        const model = this.model('school');
        model._pk = 'schoolID';
        var data;
        if (think.isEmpty(schoolname) && think.isEmpty(areaid)) {
            if (userinfo[0].usertype == 1) { // 管理员
                data = await model.where({shstate: 0}).page(page, size).order('schoolID desc').countSelect();
            } else {
                data = await model.where({shstate: 0, 
                    _complex:{schoolID: userinfo[0].schoolid, parentid:userinfo[0].schoolid,_logic:'or'}}).page(page, size).order('schoolID desc').countSelect();
            }
        } else if (!think.isEmpty(schoolname)) {
            if (userinfo[0].usertype == 1) { // 管理员
                data = await model.where({schoolName: ['like', `%${schoolname}%`], shstate: 0}).order('schoolID desc').page(page, size).countSelect();
            } else {
                data = await model.where({schoolName: ['like', `%${schoolname}%`], shstate: 0,
                _complex:{schoolID: userinfo[0].schoolid, parentid:userinfo[0].schoolid,_logic:'or'}}).order('schoolID desc').page(page, size).countSelect();
            }
        } else {
            if (userinfo[0].usertype == 1) { // 管理员
                data = await model.where({areaid: areaid, shstate: 0}).page(page, size).order('schoolID desc').countSelect();
            } else {
                data = await model.where({areaid: areaid, shstate: 0, 
                    _complex:{schoolID: userinfo[0].schoolid,parentid:userinfo[0].schoolid, _logic:'or'}}).page(page, size).order('schoolID desc').countSelect();
            }
        }
        
        const arrdata = [];
        for (const item of data.data) {
            item.pics = await this.model('school').getPicsbyid(item.schoolID);
            item.shstate = await this.model('school').getstate(item.schoolID);
            arrdata.push(item);
        }
        data.data = arrdata;

        
        return this.success(data)
    }

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

    async deleteAction() {
        const id = this.get('id');
        // const data = {
        //     shstate: 1
        // }
        await this.getdatabyname('home_discuss');
        await this.model('school').where({schoolID:id}).delete();
        await this.model('scenery').where({schoolid: id}).delete();
        await this.model('student').where({schoolid: id}).delete();
        await this.model('source').where({sourceType: 0, targetid: id}).delete();
        await this.model('discuss').where({distype: 2, targetid: id}).delete();
        return this.success('学校及关联的景点、学生、图片、评论删除成功')
    }
    
    async addEditAction() {
        const schoolname = this.post('schoolname');
        const province = this.post('province') || '';
        const city = this.post('city') || '';
        const address = this.post('address') || '';
        const schooldesc= this.post('schooldesc');
        const longitude = this.post('longitude');
        const latitude = this.post('latitude');
        const soundurl = this.post('soundurl');
        const videourl = this.post('videourl');
        const areaid = this.post('areaid');
        const parentid = this.post('parentid') || 0;
        const shortname = this.post('shortname');
        const id = this.get('id');
        let userinfo = await this.cache('userinfo');

        let param = {
            schoolName: schoolname,
            shortName: shortname,
            province: province,
            city: city,
            address: address,
            schooldesc: schooldesc,
            longitude: longitude,
            latitude: latitude,
            soundurl,
            videourl,areaid,parentid,
            createbyuserid: userinfo[0].sysUserID
        }; 
        await this.getdatabyname('home_discuss');
        if (think.isEmpty(id)) {
            const userDataCount = await this.model('school').where({schoolName: schoolname}).count('schoolID');
            if (userDataCount == 0) {
                let model = this.model('school');
                const insertid = await model.add(param);
                
                // 上传学校图片
                if (insertid) {
                    // const sourceaddress = this.post('sourceaddress');
                    // const insertid2 = await this.model('source').add({
                    //     sourceType:0,
                    //     sourceAddress: sourceaddress,
                    //     targetid: insertid
                    // });
                    return this.json({
                            insertid:insertid
                        });
                }
            } else {
                return this.fail('学校名称不能重复,添加失败')
            }
        } else {
            // 1 删除source, 2修改
            await this.model('source').where({targetid:id}).delete();
            await this.model('school').where({schoolID:id}).update(param);
            return this.success('学校修改成功')
        }
        
    }
}