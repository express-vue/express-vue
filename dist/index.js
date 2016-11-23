'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defaults = require('./defaults');

var _parser = require('./parser');

var _utils = require('./utils');

function expressVue(componentPath, options, callback) {

    var defaults = new _defaults.Defaults(options.settings.vue);
    var types = new _defaults.Types();
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue';
    defaults.options = options;

    var componentArray = [(0, _parser.layoutParser)(defaults.layoutPath, defaults, types.LAYOUT), (0, _parser.componentParser)(componentPath, defaults, types.COMPONENT)];

    if (defaults.options.vue && defaults.options.vue.components) {
        for (var component in defaults.options.vue.components) {
            if (defaults.options.vue.components.hasOwnProperty(component)) {
                var componentFile = defaults.componentsDir + defaults.options.vue.components[component] + '.vue';
                componentArray.push((0, _parser.componentParser)(componentFile, defaults, types.SUBCOMPONENT));
            }
        }
    }
    Promise.all(componentArray).then(function (components) {
        (0, _utils.renderHtmlUtil)(components, defaults).then(function (html) {
            callback(null, html);
        }).catch(function (error) {
            callback(new Error(error));
        });
    }, function (error) {
        callback(new Error(error));
    });
}

expressVue.componentParser = _parser.componentParser;

exports.default = expressVue;
module.exports = exports['default'];