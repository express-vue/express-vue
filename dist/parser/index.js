'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.layoutParser = exports.componentParser = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _htmlMinifier = require('html-minifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

var _defaults = require('../defaults');

var _requireFromString = require('require-from-string');

var _requireFromString2 = _interopRequireDefault(_requireFromString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var htmlMinifier = _htmlMinifier2.default.minify;
var htmlRegex = /(<template.*?>)([\s\S]*?)(<\/template>)/gm;
var scriptRegex = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;
var types = new _defaults.Types();

function htmlParser(body, minify) {
    var bodyString = body.match(htmlRegex)[0];
    if (bodyString) {
        bodyString = bodyString.replace(htmlRegex, '$2');
    }

    if (minify) {
        bodyString = htmlMinifier(bodyString, {
            collapseWhitespace: true
        });
    }

    return bodyString;
}

var DataObject = function DataObject(componentData, defaultData, type) {
    _classCallCheck(this, DataObject);

    switch (type) {
        case types.COMPONENT:
            this.data = Object.assign({}, componentData, defaultData);
            break;
        case types.SUBCOMPONENT:
            this.data = componentData;
            break;
    }
};

function dataParser(script, defaults, type) {
    var finalScript = {};
    for (var element in script) {
        if (script.hasOwnProperty(element)) {
            if (element === 'data') {
                (function () {
                    var data = new DataObject(script.data(), defaults.options.data, type).data;
                    finalScript[element] = function () {
                        return data;
                    };
                })();
            } else {
                finalScript[element] = script[element];
            }
        }
    }
    return finalScript;
}

function scriptParser(script, defaults, type) {
    var options = {
        'presets': ['es2015']
    };
    var scriptString = script.match(scriptRegex)[0].replace(scriptRegex, '$2');
    var babelScript = require('babel-core').transform(scriptString, options);
    var evalScript = (0, _requireFromString2.default)(babelScript.code);
    var finalScript = dataParser(evalScript.default, defaults, type);
    return finalScript;
}

function layoutParser(layoutPath, defaults, type) {
    return new Promise(function (resolve) {
        _fs2.default.readFile(layoutPath, 'utf-8', function (err, content) {
            if (err) {
                content = defaults.backupLayout;
            }

            var body = htmlParser(content);
            content = content.replace(htmlRegex, '');
            var script = scriptParser(content, defaults, type);

            resolve({
                type: type,
                template: body,
                script: script
            });
        });
    });
}

function componentParser(templatePath, defaults, type) {
    return new Promise(function (resolve, reject) {
        _fs2.default.readFile(templatePath, 'utf-8', function (err, content) {
            if (err) {
                reject(new Error(err));
            }

            var body = htmlParser(content, true);
            content = content.replace(htmlRegex, '');
            var script = scriptParser(content, defaults, type);

            var componentScript = script;
            componentScript.template = body;

            resolve({
                type: type,
                name: templatePath.match(/\w*\.vue/g)[0].replace('\.vue', ''),
                script: componentScript
            });
        });
    });
}

exports.componentParser = componentParser;
exports.layoutParser = layoutParser;