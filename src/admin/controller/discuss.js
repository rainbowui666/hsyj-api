const Base = require('./base.js');

module.exports = class extends Base {
    async listAction() {
        const model =  this.model('discuss');
        model._pk ="discussID";
        const pageindex = this.get('pageindex') || 1;
        const pagesize = this.get('pagesize') || 5;
        const shstate = this.get('shstate');
        const distype = this.get('distype');

        const start = (pageindex -1) * pagesize;
        let data,counta;
        data = await model.query("select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+" order by d.discussID desc limit "+start+","+pagesize+" ");
        counta = await model.query("select count(*) t from (select d.*,s.studentName,s.stuNo from culture_discuss d inner join culture_student s on d.studentid=s.studentID where d.distype="+distype+") t ");
      
        const pagecount = Math.ceil(counta[0].t / pagesize); //(counta[0].t + parseInt(pagesize - 1)) / pagesize;
        return this.success({counta:counta[0].t,pagecount:pagecount,pageindex:pageindex,pagesize:pagesize,data})
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