module.exports = class Di {
    constructor() {
        this.services = {};
    }

    set(key, object) {
        this.services[key] = object;
    }

    get(key) {
        return this.services[key];
    }
}