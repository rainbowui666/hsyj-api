module.exports = class extends think.Logic {
    detailAction() {
        this.allowMethods = 'get';
        this.rules = {
            schoolid: { required: true}
        }
    }
}