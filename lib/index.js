// @flow
'use strict';

import {Defaults} from './models';
import {
    setupComponentArray,
    renderError,
    renderComponents
} from './utils';

let promiseArray = [];

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

export default expressVue;
