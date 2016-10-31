'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderHtmlUtil = exports.layoutUtil = exports.renderUtil = undefined;

var _defaults = require('../defaults');

var _string = require('./string');

var renderer = require('vue-server-renderer').createRenderer();
var appRegex = /{{{app}}}/igm;
var scriptRegex = /{{{script}}}/igm;
var titleRegex = /{{{title}}}/igm;
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
    var html = '';
    renderer.renderToString(createApp(layout.script), function (error, renderedHtml) {
        html = layout.template.replace(appRegex, '<div id="app">' + renderedHtml + '</div>');
        html = html.replace(scriptRegex, renderedScriptString);
        html = html.replace(titleRegex, layout.script.data.title || defaults.options.title);
    });
    return html;
}

function renderedScript(script) {
    var scriptString = (0, _string.scriptToString)(script);
    return '<script>\n        (function () {\n            \'use strict\'\n            var createApp = function () {\n                return new Vue(\n                    ' + scriptString + '\n                )\n            }\n            if (typeof module !== \'undefined\' && module.exports) {\n                module.exports = createApp\n            } else {\n                this.app = createApp()\n            }\n        }).call(this)\n    </script>';
}

function renderHtmlUtil(components, defaults) {
    var layout = layoutUtil(components);
    var renderedScriptString = renderedScript(layout.script);
    return renderUtil(layout, renderedScriptString, defaults);
}

exports.renderUtil = renderUtil;
exports.layoutUtil = layoutUtil;
exports.renderHtmlUtil = renderHtmlUtil;