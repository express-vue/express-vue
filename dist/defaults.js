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

    _classCallCheck(this, Defaults);

    this.rootPath = obj.rootPath || __dirname + '/../';
    this.layoutsDir = obj.rootPath + obj.layoutsDir || '/app/routes/';
    this.componentsDir = obj.rootPath + obj.componentsDir || '/app/components/';
    this.defaultLayout = obj.defaultLayout || 'layout';
    this.options = obj.options || undefined;
};

exports.Types = Types;
exports.Defaults = Defaults;