class Types {
    constructor() {
        this.COMPONENT    = 'COMPONENT';
        this.SUBCOMPONENT = 'SUBCOMPONENT';
        this.LAYOUT       = 'LAYOUT';
    }
}
class Defaults {
    constructor(obj = {}) {
        this.rootPath      = obj.rootPath   || __dirname + '/../';
        this.layoutsDir    = obj.rootPath + obj.layoutsDir || '/app/routes/';
        this.componentsDir = obj.rootPath + obj.componentsDir || '/app/components/';
        this.defaultLayout = obj.defaultLayout || 'layout';
        this.options       = obj.options || undefined;
    }
}

export {Types, Defaults};
