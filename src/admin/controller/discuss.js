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
        let data,counta;
        // console.log('this.ctx.state.userId=' + this.ctx.state.userId);
        // console.dir(this.ctx.state);
        // data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and "+typecondi+" order by d.discussID desc limit "+start+","+pagesize+" ");
        // counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and "+typecondi+") t ");
        data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) order by d.discussID desc limit "+start+","+pagesize+" ");
        counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID and d.targetid in (select cs.sceneryID from culture_scenery cs where cs.schoolid in (select sch.schoolID from culture_school sch where sch.parentid=(select u.schoolid from culture_user u where u.sysUserID="+this.ctx.state.userId+"))) where d.distype="+distype+") t ");

        if (!think.isEmpty(data) && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].content = this.uncodeUtf16(data[i].content);
            }
        }
        const waitApprove = await model.field('discussID').where({distype: distype, shstate: 0}).getField('discussID');
      
        const pagecount = Math.ceil(counta[0].t / pagesize); //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
        return this.success({count:counta[0].t,totalPages:pagecount,currentPage:pageindex,pageSize:pagesize,data, waitApprove:waitApprove.length});
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