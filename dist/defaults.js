'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Types = function Types() {
    _classCallCheck(this, Types);

    this.COMPONENT = 'COMPONENT';
    this.SUBCOMPONENT = 'SUBCOMPONENT';
    this.LAYOUT = 'LAYOUT';
};

var Defaults = function Defaults() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var viewsPath = arguments[1];

    _classCallCheck(this, Defaults);

    this.rootPath = obj.rootPath === undefined ? viewsPath + '/' : obj.rootPath + '/';
    this.layoutsDir = obj.layoutsDir === undefined ? '' : this.rootPath + obj.layoutsDir + '/';
    this.componentsDir = obj.componentsDir === undefined ? '' : this.rootPath + obj.componentsDir + '/';
    this.defaultLayout = obj.defaultLayout === undefined ? '' : obj.layoutsDir === undefined ? this.rootPath + obj.defaultLayout : obj.defaultLayout;
    this.options = obj.options === undefined ? '' : obj.options;
    this.backupLayout = '<template><!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script></head><body>{{{app}}}{{{script}}}<script>app.$mount("#app")</script></body></html></template><script></script><style></style>';
    console.log(this);
};

exports.Types = Types;
exports.Defaults = Defaults;
