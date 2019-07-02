const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    async addEditAction() {
        const id = this.post('id');
        const groupname = this.post('groupname');
        const studentid = this.post('studentid')

        if (think.isEmpty(groupname)) {
            return this.fail('团队名称必填')
        }
        const dataExsts = await this.model('group').where({groupName: groupname}).select();
        if (dataExsts && dataExsts.data && dataExsts.data.length > 0) {
            return this.fail('团队名称重复,添加失败')
        }
        let param = {
            activityid:id,
            groupName:groupname,
            studentid: studentid
        }

        const insertid = await this.model('group').add(param);
        if (!think.isEmpty(insertid)) {
            let para2 = {
                groupid:insertid,studentid:studentid,activityid:id
            }
            let insertidgr = await this.model('student_group').add(para2);
        }
        return this.success('添加成功')
    }

    async readyScanAction() {
        const studentid = this.get('studentid');
        this.cache('scan'+studentid, studentid);
        console.log('readyScanAction-------------------')
        return this.success({'scan': studentid})
    }

    async showGroupAction() {
        const groupid = this.get('groupid');
        return this.success({groupid: groupid})
    }

    async joinGroupAction() {
        const groupid = this.get('groupid');
        const studentid = this.get('studentid');
        const activityid = this.get('activityid');
        let para = {
            groupid,studentid,activityid
        }

        const scanstudnetid = await this.cache('scan'+studentid);
        console.log('scanstudnetid-----', scanstudnetid, groupid,studentid,activityid)
        if (!think.isEmpty(scanstudnetid)) {  
            this.cache('scan'+studentid, null);
                  
            const actData = await this.model('activity').field(['activityID','groupNum']).where({activityID: activityid}).find();
            let groupnum = 0
            if (!think.isEmpty(actData)) {
                groupnum = parseInt(actData.groupNum);
            }

            let groupcount = await this.model('student_group').field('studentid').where({activityID: activityid}).getField('studentid');
            groupcounts = _.uniq(groupcounts);
            if (groupcount >= groupnum) {
                return this.fail('加入失败, 超过团体活动最大限制人数')
            } else {
                console.log('joingroup------',groupid,studentid,activityid)
                // console.log('success group----')
                let insertid = await this.model('student_group').add(para);
                const groupdate = await this.model('group').where({groupid: groupid}).find();
                return this.success({msg:'扫码加入成功',groupName: groupdate.groupName});
            }
        } else {
            return this.display('pages/groupSuccess')
        }
    }

    async showQrAction() {
        const url = this.get('url');
        const studentid = this.get('studentid');
        const activityid = this.get('activityid');

        
        console.log('showqr', url, studentid, activityid)
        
            
            const qrService = this.service('qr', 'api');
            this.type = 'image/svg+xml';
            this.body = qrService.getQrByUrl(url+'&studentid='+studentid+'&activityid='+activityid);
        
    }
}