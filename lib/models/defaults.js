// @flow
const LRU = require('lru-cache');
const path = require('path');
const deepmerge = require('deepmerge');
const options = {
    max: 500,
    maxAge: 1000 * 60 * 60
};
const lruCache = LRU(options);

class Defaults {
    rootPath: string;
    componentsPath: string;
    viewsPath: string;
    layout: {start: string, middle: string, end: string};
    options: Object;
    cache: LRU;
    vue: Object;
    data: Object;
    constructor(options: Object = {}) {
        this.cache = lruCache;
        this.options = options;

        if (options.rootPath) {
            this.rootPath = path.resolve(options.rootPath);
        }
        if (options.componentsPath) {
            this.componentsPath = path.resolve(this.rootPath, options.componentsPath);
        }
        if (options.viewsPath) {
            this.viewsPath = path.resolve(this.rootPath, options.viewsPath);
        }
        if (options.layout) {
            this.layout = options.layout;
        } else {
            this.layout = {
                start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script>',
                middle: '<body><div id="app">',
                end: '</div></body></html>'
            };
        }
        if (options.vue) {
            this.vue = options.vue;
        } else {
            this.vue = {};
        }
        if (options.data) {
            this.data = options.data;
        } else {
            this.data = {};
        }
    }
    mergeVueObject(newVueObject: Object): void {
        this.vue = deepmerge(this.vue, newVueObject);
    }
    mergeDataObject(newDataObject: Object): void {
        this.data = deepmerge(this.data, newDataObject);
    }
}

module.exports = Defaults;
