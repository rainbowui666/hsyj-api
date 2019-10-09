const Base = require('./base.js');

module.exports = class extends Base {
    uncodeUtf16(str){
        var reg = /\&#.*?;/g;
        var result = str.replace(reg,function(char){
            var H,L,code;
            if(char.length == 9 ){
                code = parseInt(char.match(/[0-9]+/g));
                H = Math.floor((code-0x10000) / 0x400)+0xD800;
                L = (code - 0x10000) % 0x400 + 0xDC00;
                return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
            }else{
                return char;
            }
        });
        return result;
     }

    async listAction() {
        const model =  this.model('discuss');
        model._pk ="discussID";
        let pageindex = this.get('pageindex') || 1;
        let pagesize = this.get('pagesize') || 5;
        const scenerytype = this.get('scenerytype');
        const shstate = this.get('shstate');
        const distype = this.get('distype');

        pageindex = parseInt(pageindex);
        pagesize = parseInt(pagesize)
        const start = (pageindex -1) * pagesize;
        let data = [],counta = [];

        let orgData = null;

        // 不同类别机构ids
        if (distype == 0) {
            orgData = await model.query('select case parentid when 0 then schoolid else parentid end as parentid from culture_school where schoolid in (select schoolid from culture_scenery where sceneryid in ( select targetid from culture_discuss where distype=0))');
        } else {
            orgData = await model.query('select case parentid when 0 then schoolid else parentid end as parentid from culture_school where schoolid in (select createbyschoolid from culture_activity where activityid in ( select targetid from culture_discuss where distype=1))');
        }

        let arr = [];
        let allcreateids =''
        if (orgData && orgData.length > 0) {
            for (let i = 0; i < orgData.length; i++) {
                arr.push(orgData[i].parentid);
            }
        }
        if (arr.length > 0) {
            allcreateids = arr.join(',');
        }
        console.log('curruser---', allcreateids, this.ctx.state.userId);

        // 查找登录用户机构id
        let curUserOrg = await this.model('user').field('schoolid').where({sysUserID: this.ctx.state.userId}).getField('schoolid');
        let waitApprove = [];
        if (orgData && orgData.length>0 && curUserOrg.length > 0) {
           
            if (distype == 0) {
                console.log('start get ----', distype, curUserOrg[0])
                data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype=0 and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid in (select u.schoolid from culture_user u where u.schoolid=("+curUserOrg[0]+")))) order by d.discussID desc limit "+start+","+pagesize+" ");
                counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid in (select u.schoolid from culture_user u where u.schoolid=("+curUserOrg[0]+")))) where d.distype=0) t ");
                waitApprove = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype=0 and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid in (select u.schoolid from culture_user u where u.schoolid=("+curUserOrg[0]+")))) and d.shstate=0 order by d.discussID desc ");
            } else {
                console.log('start get2222 ----', distype)
                data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype=1 and d.targetid in (select cs.activityid from culture_activity cs where cs.createbyschoolid in (select sch.schoolID from culture_school sch where sch.schoolid in (select u.schoolid from culture_user u where u.schoolid in ("+curUserOrg[0]+")))) order by d.discussID desc limit "+start+","+pagesize+"");
                counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID and d.targetid in (select cs.activityid from culture_activity cs where cs.createbyschoolid in (select sch.schoolID from culture_school sch where sch.schoolid in (select u.schoolid from culture_user u where u.schoolid in ("+curUserOrg[0]+")))) where d.distype=1) t ");
                waitApprove = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype=1 and d.targetid in (select cs.activityid from culture_activity cs where cs.createbyschoolid in (select sch.schoolID from culture_school sch where sch.schoolid in (select u.schoolid from culture_user u where u.schoolid in ("+curUserOrg[0]+")))) and d.shstate=0 order by d.discussID desc");
            }
        }

        if (!think.isEmpty(data) && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].content = this.uncodeUtf16(data[i].content);
            }
        }
        // const waitApprove = await model.field('discussID').where({distype: distype, shstate: 0}).getField('discussID');
        
        // if (orgData && orgData.length>0 && allcreateids.indexOf(curUserOrg[0]) != -1) {
        //     waitApprove = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) and d.shstate=0 order by d.discussID desc");
        // }
        const pagecount = counta && counta.length > 0 ? Math.ceil(counta[0].t / pagesize):0; //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
        return this.success({count:counta && counta.length > 0 ?counta[0].t: 0,totalPages:pagecount,currentPage:pageindex,pageSize:pagesize,data, waitApprove:waitApprove.length});

    }

    async list2Action() {
        const model =  this.model('discuss');
        model._pk ="discussID";
        let pageindex = this.get('pageindex') || 1;
        let pagesize = this.get('pagesize') || 5;
        const scenerytype = this.get('scenerytype');
        const shstate = this.get('shstate');
        const distype = this.get('distype');

        // let typecondi = ''
        // if (!think.isEmpty(scenerytype)) {
        //     typecondi = 'scenerytype=1'
        // } else if (distype == 0){
        //     typecondi = 'scenerytype!=1 or scenerytype is null'
        // } else {
        //     typecondi = '1=1'
        // }

        pageindex = parseInt(pageindex);
        pagesize = parseInt(pagesize)
        const start = (pageindex -1) * pagesize;
        let data = [],counta = [];

        let createuserData = null;
        if (distype == 0) {
            createuserData = await model.query('select createbyuserid from culture_school where schoolID in (select cs.schoolid from culture_discuss d inner join culture_scenery cs on d.targetid=cs.sceneryID where d.distype=0) ');
        } else {
            createuserData = await model.query('select createbyuserid from culture_school where schoolID in (select ca.createbyschoolid from culture_discuss d inner join culture_activity ca on d.targetid=ca.activityID where d.distype=1)');
        }
        // let curruser = await this.model('user').field('schoolid').where({sysUserID:this.ctx.state.userId}).getField('schoolid');

        let arr = [];
        let allcreateids =''
        if (createuserData && createuserData.length > 0) {
            for (let i = 0; i < createuserData.length; i++) {
                arr.push(createuserData[i].createbyuserid);
            }
        }
        if (arr.length > 0) {
            allcreateids = arr.join(',');
        }
        console.log('curruser---', allcreateids, this.ctx.state.userId)

        // console.log('this.ctx.state.userId=' + this.ctx.state.userId);
        // console.dir(this.ctx.state);
        // data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and "+typecondi+" order by d.discussID desc limit "+start+","+pagesize+" ");
        // counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and "+typecondi+") t ");
        if (createuserData && createuserData.length>0 && allcreateids.indexOf(this.ctx.state.userId) != -1) {
            console.log('start get ----', distype)
            if (distype == 0) {
                console.log('0------')
                data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype=0 and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) order by d.discussID desc limit "+start+","+pagesize+" ");
                counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) where d.distype=0) t ");
            } else {
                console.log('1------', distype)
                data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype=1 and d.targetid in (select cs.activityid from culture_activity cs where cs.createbyschoolid in (select sch.schoolID from culture_school sch where sch.schoolid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) order by d.discussID desc limit "+start+","+pagesize+"");
                counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID and d.targetid in (select cs.activityid from culture_activity cs where cs.createbyschoolid in (select sch.schoolID from culture_school sch where sch.schoolid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) where d.distype=1) t ");
            }
        }
        if (!think.isEmpty(data) && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].content = this.uncodeUtf16(data[i].content);
            }
        }
        // const waitApprove = await model.field('discussID').where({distype: distype, shstate: 0}).getField('discussID');
        let waitApprove = [];
        if (createuserData && createuserData.length>0 && allcreateids.indexOf(this.ctx.state.userId) != -1) {
            waitApprove = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) and d.shstate=0 order by d.discussID desc");
        }
        const pagecount = counta && counta.length > 0 ? Math.ceil(counta[0].t / pagesize):0; //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
        return this.success({count:counta && counta.length > 0 ?counta[0].t: 0,totalPages:pagecount,currentPage:pageindex,pageSize:pagesize,data, waitApprove:waitApprove.length});
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

    async updateAction() {
        const id = this.get('id');
        const shstate = this.get('shstate');
        const isrecommend = this.get('isrecommend') || 0;
        const data = {
            shstate,isrecommend
        }

        // 查找缓存
        await this.getdatabyname('home_discuss');

        await this.model('discuss').where({discussID:id}).update(data);
        return this.success('修改成功')
    }
}