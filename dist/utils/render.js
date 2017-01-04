'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderHtmlUtil = exports.layoutUtil = exports.renderUtil = undefined;

var _defaults = require('../defaults');

var _string = require('./string');

var _meta = require('./meta');

var _meta2 = _interopRequireDefault(_meta);

var _paramCase = require('param-case');

var _paramCase2 = _interopRequireDefault(_paramCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderer = require('vue-server-renderer').createRenderer();
var appRegex = /{{{app}}}/igm;
var scriptRegex = /{{{script}}}/igm;
var headRegex = /<\/head>/igm;
var types = new _defaults.Types();

function createApp(script) {
    var Vue = require('vue');
    return new Vue(script);
}

function layoutUtil(components) {
    var layout = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var component = _step.value;

            switch (component.type) {
                case types.LAYOUT:
                    layout = component;
                    break;
                case types.COMPONENT:
                    layout.script = component.script;
                    break;
                case types.SUBCOMPONENT:
                    if (layout.script.components) {
                        layout.script.components[component.name] = component.script;
                    } else {
                        layout.script.components = {};
                        layout.script.components[component.name] = component.script;
                    }
                    break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return layout;
}

function renderUtil(layout, renderedScriptString, defaults) {
    return new Promise(function (resolve, reject) {
        renderer.renderToString(createApp(layout.script), function (error, renderedHtml) {
            if (error) {
                reject(error);
            }
            var html = '';
            var meta = '';
            html = layout.template.replace(appRegex, '<div id="app">' + renderedHtml + '</div>');
            html = html.replace(scriptRegex, renderedScriptString);
            if (defaults.options.vue && defaults.options.vue.meta) {
                meta = (0, _meta2.default)(defaults.options.vue.meta);
            } else {
                meta = (0, _meta2.default)({});
            }

            html = html.replace(headRegex, meta);
            resolve(html);
        });
    });
}

function renderedScript(script, components) {

    var componentsString = '';

    for (var component in components) {
        if (components.hasOwnProperty(component)) {
            var currentComponent = components[component];
            if (currentComponent.type === types.SUBCOMPONENT) {
                delete script.components[currentComponent.name];
                componentsString = componentsString + ('Vue.component(\'' + (0, _paramCase2.default)(currentComponent.name) + '\', ' + (0, _string.scriptToString)(currentComponent.script) + ');\n');
            }
        }
    }

    var scriptString = (0, _string.scriptToString)(script);

    return '<script>\n        (function () {\n            \'use strict\'\n            ' + componentsString + '\n            var createApp = function () {\n                return new Vue(\n                    ' + scriptString + '\n                )\n            }\n            if (typeof module !== \'undefined\' && module.exports) {\n                module.exports = createApp\n            } else {\n                this.app = createApp()\n            }\n        }).call(this)\n    </script>';
}

function renderHtmlUtil(components, defaults) {
    var layout = layoutUtil(components);
    var renderedScriptString = renderedScript(layout.script, components);
    return renderUtil(layout, renderedScriptString, defaults);
}

exports.renderUtil = renderUtil;
exports.layoutUtil = layoutUtil;
exports.renderHtmlUtil = renderHtmlUtil;