'use strict';

import {
    Defaults,
    Types
} from './models';
import {
    layoutParser,
    componentParser
} from './parser';
import {renderHtmlUtil} from './utils';

let types = new Types();

function expressVue(componentPath, options, callback) {

    let defaults = new Defaults(options.settings.vue, options.settings.views);
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
            console.error(error);
            callback(new Error(error));
        });
    }, function(error) {
        console.error(error);
        callback(new Error(error));
    });
}

export default expressVue;
