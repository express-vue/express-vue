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

    if (defaults.options.components) {
        for (var component in defaults.options.components) {
            if (defaults.options.components.hasOwnProperty(component)) {
                const componentFile = defaults.componentsDir + defaults.options.components[component] + '.vue';
                componentArray.push(componentParser(componentFile, defaults, types.SUBCOMPONENT));
            }
        }
    }

    Promise.all(componentArray).then(function(components) {
        const html = renderHtmlUtil(components, defaults);
        callback(null, html);
    }, function(error) {
        callback(new Error(error));
    });
}

expressVue.componentParser = componentParser;

export default expressVue;
