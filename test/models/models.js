import test   from 'ava';
import path from 'path';
import {Defaults, Types, DataObject} from '../../src/models';

const options = {
    rootPath: path.join(__dirname, 'tests'),
    componentsPath: 'vueFiles/components',
    viewsPath: 'vueFiles',
    layout: {
        start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script>',
        middle: '<body><div id="app">',
        end: '</div></body></html>'
    }
};
const types         = new Types();
const defaultObject = new Defaults(options);
const dataObject    = new DataObject(options, defaultObject, types.COMPONENT);
const dataObjectSub = new DataObject(options, defaultObject, types.SUBCOMPONENT);

//Examples
const exampleObject = {
    rootPath: options.rootPath,
    componentsPath: options.rootPath + '/' + options.componentsPath,
    viewsPath:  options.rootPath + '/' + options.viewsPath,
    layout: {
        start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script>',
        middle: '<body><div id="app">',
        end: '</div></body></html>',
    },
    options:{
        rootPath: options.rootPath,
        componentsPath: 'vueFiles/components',
        viewsPath: 'vueFiles'
    },
    cache: {
        max: 500,
        maxAge: 3600000
    }
};

test('Root Path', t => {
    t.is(defaultObject.rootPath, exampleObject.rootPath);
});

test('Components Path', t => {
    t.is(defaultObject.componentsPath, exampleObject.componentsPath);
});

test('Views Path', t => {
    t.is(defaultObject.viewsPath, exampleObject.viewsPath);
});


test('Default Layout', t => {
    t.deepEqual(defaultObject.layout, exampleObject.layout);
});
