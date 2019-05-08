const qr = require('qr-image');

module.exports = class extends think.Service {
    getQrByUrl(url) {
        return qr.imageSync(url,{type:'svg'});
    }
}