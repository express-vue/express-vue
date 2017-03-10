// @flow
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
let promiseArray = [];

function setupComponentArray(componentPath: string, defaults: Defaults) {
    let array = [];
    array.push(layoutParser(defaults.layoutPath, defaults, types.LAYOUT));
    array.push(componentParser(componentPath, defaults, types.COMPONENT));

    if (defaults.options.vue && defaults.options.vue.components) {
        for (var component in defaults.options.vue.components) {
            if (defaults.options.vue.components.hasOwnProperty(component)) {
                const componentFile = defaults.componentsDir + defaults.options.vue.components[component] + '.vue';
                array.push(componentParser(componentFile, defaults, types.SUBCOMPONENT));
            }
        }
    }
    return array;
}

function renderError(error: string, callback: Function) {
    console.error(error);
    callback(new Error(error));
}

function renderComponents(components: Array<Object>, defaults: Defaults, callback: Function) {
    renderHtmlUtil(components, defaults).then(function(html) {
        callback(null, html);
    })
    .catch(function(error) {
        renderError(error, callback);
    });
}

function expressVue(componentPath: string, options: Object, callback: Function) {

    let defaults = new Defaults(options);
    promiseArray = setupComponentArray(componentPath, defaults);

    Promise.all(promiseArray)
    .then(function(components) {
        renderComponents(components, defaults, callback);
    })
    .catch(function(error) {
        renderError(error, callback);
    });
}

export {
    expressVue,
    expressVue as default,
    renderError,
    setupComponentArray,
    renderComponents
};
