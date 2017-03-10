// @flow
class Defaults {
    rootPath: string;
    layoutsDir: string;
    componentsDir: string;
    defaultLayout: string;
    options: Object;
    backupLayout: string;
    constructor(obj: Object = {}, viewsPath: string) {
        this.rootPath      = obj.rootPath      === undefined ? viewsPath + '/' : obj.rootPath + '/';
        this.layoutsDir    = obj.layoutsDir    === undefined ? '' : this.rootPath + obj.layoutsDir + '/';
        this.componentsDir = obj.componentsDir === undefined ? '' : obj.componentsDir + '/';
        this.defaultLayout = obj.defaultLayout === undefined ? '' : obj.layoutsDir === undefined ? this.rootPath + obj.defaultLayout : obj.defaultLayout;
        this.options       = obj.options       === undefined ? {} : obj.options;
        this.backupLayout  = '<template><!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script></head><body>{{{app}}}{{{script}}}</body></html></template><script></script><style></style>';
    }
}

export default Defaults;
