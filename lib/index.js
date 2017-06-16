// @flow
'use strict';

import {Defaults} from './models';
import {
    setupComponentArray,
    renderError,
    renderComponents
} from './utils';

const NodeCache = require('node-cache');
let cacheConfig = {};
const myCache = new NodeCache(cacheConfig);
function expressVue(componentPath: string, options: Object, callback: Function) {
    const cacheKey = componentPath + JSON.stringify(options.data);
    myCache.get(cacheKey, (error, cachedString) => {
        if (error) {
            callback(error, null);
        } else if (cachedString) {
            callback(null, cachedString);
        } else {
            let defaults = new Defaults(options);
            setupComponentArray(componentPath, defaults).then(promiseArray => {
                Promise.all(promiseArray)
                    .then(function(components) {
                        renderComponents(components, defaults, (error, html) => {
                            if (error) {
                                callback(error);
                            } else {
                                myCache.set(cacheKey, html, (err, success) => {
                                    if (err) {
                                        callback(err);
                                    } else if (success) {
                                        callback(null, html);
                                    }
                                });
                            }
                        });
                    })
                    .catch(function(error) {
                        renderError(error, callback);
                    });
            }).catch(error => {
                renderError(error, callback);
            });
        }
    });
}

export default expressVue;
