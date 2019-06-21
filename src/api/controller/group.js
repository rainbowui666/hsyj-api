const Base = require('./base.js');

module.exports = class extends Base {
    async addEditAction() {
        const id = this.post('id');
        const groupname = this.post('groupname');
        const studentid = this.post('studentid')

        let param = {
            activityid:id,
            groupName:groupname,
            studentid: studentid
        }

        const insertid = await this.model('group').add(param);
        return this.success('添加成功')
    }

    async readyScanAction() {
        const studentid = this.get('studentid');
        this.cache('scan'+studentid, studentid);
        return this.success({'scan': studentid})
    }

    async joinGroupAction() {
        const groupid = this.get('groupid');
        const studentid = this.get('studentid');
        const activityid = this.get('activityid');
        let para = {
            groupid,studentid,activityid
        }

        const scanstudnetid = await this.cache('scan'+studentid);
        if (!think.isEmpty(scanstudnetid)) {  
            this.cache('scan'+studentid, null);
                  
            const actData = await this.model('activity').field(['activityID','groupNum']).where({activityID: activityid}).find();
            let groupnum = 0
            if (!think.isEmpty(actData)) {
                groupnum = parseInt(actData.groupNum);
            }

            const groupcount = await this.model('student_group').where({activityID: activityid}).count();
            if (groupcount >= groupnum) {
                // console.log('fail group----')
                return this.fail('加入失败, 超过团体活动最大限制人数')
            } else {
                console.log('joingroup------',groupid,studentid,activityid)
                // console.log('success group----')
                let insertid = await this.model('student_group').add(para);
                return this.success('扫码加入成功')
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