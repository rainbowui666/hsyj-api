const Base = require('./base.js');
const _ = require('lodash');

module.exports = class extends Base {
    utf16toEntities(str) {
        var patt=/[\ud800-\udbff][\udc00-\udfff]/g;
        // 检测utf16字符正则
        str = str.replace(patt, function(char){
            var H, L, code;
            if (char.length===2) {
                H = char.charCodeAt(0);
                // 取出高位
                L = char.charCodeAt(1);
                // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
        return str;
    }

    async addEditAction() {
        const id = this.post('id');
        const groupname = this.utf16toEntities(this.post('groupname'));
        const studentid = this.post('studentid')

        if (think.isEmpty(groupname)) {
            return this.fail('团队名称必填')
        }

        // 有没有加入团队
        const groupstudnetData = await this.model('student_group').where({activityid: id, studentid: studentid}).select();
        if (!think.isEmpty(groupstudnetData)) {
            // console.log('groupstudnetData', groupstudnetData)
            // groupstudnetData.groupname = await this.model('group').field('groupName').where({groupID: groupstudnetData[0].groupid}).find()
            return this.fail('你已加入过团队,不能再创建团队')
        }
        
        const dataExsts = await this.model('group').where({groupName: groupname, activityid:id}).select();
        if (dataExsts && dataExsts.length > 0) {
            return this.fail('团队名称被抢注,请更换')
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
        // console.log('readyScanAction-------------------')
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

        const hasCreateGroup = await this.model('group').where({groupid: groupid, studentid:studentid, activityid: activityid}).select();
        if (!think.isEmpty(hasCreateGroup)) {
            return this.fail('你已创建团队,不能再加入团队')
        }
        const hasjoinData = await this.model('student_group').field('studentid').where({activityID: activityid, studentid: studentid}).getField('studentid');
        if (!think.isEmpty(hasjoinData)) {
            return this.fail('你已加过团队,不能再加入团队')
        }

        const scanstudnetid = await this.cache('scan'+studentid);
        // console.log('joinGroup.scanstudnetid-----', scanstudnetid, groupid,studentid,activityid)
        if (!think.isEmpty(scanstudnetid)) {  
            this.cache('scan'+studentid, null);
                  
            const actData = await this.model('activity').field(['activityID','groupNum']).where({activityID: activityid}).find();
            let groupnum = 0
            if (!think.isEmpty(actData)) {
                groupnum = parseInt(actData.groupNum);
            }

            let groupcount = await this.model('student_group').field('studentid').where({activityID: activityid, groupid: groupid}).getField('studentid');
            groupcount = _.uniq(groupcount);
            console.log('groupcount=====', groupcount, groupnum)
            if (groupcount.length >= groupnum) {
                return this.fail('加入失败, 超过团体活动最大限制人数')
            } else {
                console.log('joingroup------',groupid,studentid,activityid)
                // console.log('success group----')
                let insertid = await this.model('student_group').add(para);
                const groupdate = await this.model('group').where({groupid: groupid}).find();

                // 报名
                let hasbaomin = await this.model('student_activity').where({activityid:activityid,studentID:studentid}).find();
                if (think.isEmpty(hasbaomin)) {
                    let para3 = {
                        studentID:studentid,activityid:activityid,shstate:1
                    }
                    let insertid2 = await this.model('student_activity').add(para3);
                }
                if (groupdate && groupdate.groupName) {
                    let moje = this.uncodeUtf16(groupdate.groupName);
                    groupdate.groupName = moje;
                }
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