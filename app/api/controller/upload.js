const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
    indexAction() {
        this.display();
    }

    uploadFileAction() {
        var self = this;
        var fileInfo = this.file('qqfile');

        if (think.isEmpty(fileInfo)) {
            return this.fail('保存失败');
        }
        const that = this;
        let extension = fileInfo.name;
        if (extension.indexOf('.jpg') != -1 || extension.indexOf('.jpg') != -1) {
            extension = '.jpg';
        } else if (extension.indexOf('.png') != -1) {
            extension = '.png';
        }
        //   const filename = '/static/upload/' + think.uuid(16) + extension;
        let exname = think.uuid(16) + extension;
        const filename = this.config('image.user') + exname;

        const is = fs.createReadStream(fileInfo.path);
        const os = fs.createWriteStream(filename);
        is.pipe(os);

        if (fileInfo) {
            self.json({
                error: 0,
                errmsg: 'ok',
                filename: exname,
                success: true //只有success返回true才认为上传成功
            });
        } else {
            self.error();
        }
    }

    // async upload2Action() {
    //     const circleId = this.post('circleId');
    //     const img = this.file('file');
    //     const _name = img.name;
    //     const tempName = _name.split('.');
    //     const timestamp = _.uniqueId('circle');
    //     const name = timestamp + '-' + circleId + '.' + tempName[tempName.length - 1];
    //     const thumbUrl = this.config('image.circle') + '/' + name;
    //     const thumbSmallUrl = this.config('image.circle') + '/small/' + name;
    //     fs.renameSync(img.path, thumbUrl);
    //     images(thumbUrl + '').resize(96).save(thumbSmallUrl);
    //     const imgObj = await this.model('circle_img').add({ circle_id: circleId, url: 'https://static.huanjiaohu.com/image/circle/small/' + name });
    //     return this.json(imgObj);
    //   }
};
//# sourceMappingURL=upload.js.map