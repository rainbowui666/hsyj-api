const Base = require('./base.js');
const XLSX = require('xlsx');
const fs = require('fs');

module.exports = class extends Base {
    async importAction() {
        var self = this;
        var fileInfo = this.file('qqfile');
        const workbook = XLSX.readFile(fileInfo.path);
        const sheetName = workbook.SheetNames;
        let excelData = [];
        let paramsArr = [];
        let fromTo;
        let arrschool = [];
        for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]['!ref'];
            //解析excel文件得到数据
            // excelData = excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            arrschool.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            }
        }

        if (arrschool && arrschool.length > 0) {
            let arrPublic  = arrschool[0]; // 公办
            let arrppubschool = []
            for (let i = 0; i < arrPublic.length; i++) {
                const datasch = await this.model('school').where({schoolName:arrPublic[i]['学  校']}).count('schoolID');
                if (datasch == 0) {
                    arrppubschool.push({schoolName: arrPublic[i]['学  校'], ispublic: 1});
                }
            }
            await this.model('school').addMany(arrppubschool);

            if (arrschool.length > 1) {
                let arrprivate = arrschool[1]; // 民办
                let arrprivateschool = []
                for (let i = 0; i < arrprivate.length; i++) {
                    arrprivateschool.push({schoolName:arrprivate[i]['学  校'], ispublic: 0});
                }
                await this.model('school').addMany(arrprivateschool);
            }
            
        }

        // if (think.isEmpty(fileInfo)) {
        //     return this.fail('保存失败');
        //   }
        // let sheetsData = Collect(excelData).map(item => {
        //     return {
        //     a        : item['序号'],
        //     d: item['学术']
        //     }
        //     }).all();
        return this.success(arrschool);
    }
}