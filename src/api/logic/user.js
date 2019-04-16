module.exports = class extends think.Logic {
    deleteAction() {
        this.allowMethods = 'get';
        this.rules = {
            userid: { required: true}
        }
    }
}