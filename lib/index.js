'use strict';

import {
    Defaults,
    Types
} from './defaults';
import {
    layoutParser,
    componentParser
} from './parser';
import {renderHtmlUtil} from './utils';

function expressVue(componentPath, options, callback) {

    let defaults = new Defaults(options.settings.vue);
    let types    = new Types();
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue';
    defaults.options = options;

    let componentArray = [
        layoutParser(defaults.layoutPath, defaults, types.LAYOUT),
        componentParser(componentPath, defaults, types.COMPONENT)
    ];

    if (defaults.options.vue && defaults.options.vue.components) {
        for (var component in defaults.options.vue.components) {
            if (defaults.options.vue.components.hasOwnProperty(component)) {
                const componentFile = defaults.componentsDir + defaults.options.vue.components[component] + '.vue';
                componentArray.push(componentParser(componentFile, defaults, types.SUBCOMPONENT));
            }
        }
    }
    Promise.all(componentArray).then(function(components) {
        renderHtmlUtil(components, defaults).then(function(html) {
            callback(null, html);
        }).catch(function(error) {
            callback(new Error(error));
        });
    }, function(error) {
        callback(new Error(error));
    });
}

expressVue.componentParser = componentParser;

export default expressVue;
