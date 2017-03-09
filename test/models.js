import test   from 'ava';
import {Defaults, Types} from '../lib/defaults';

const object  = {
    componentsDir: '/baz',
    defaultLayout: 'qux'
};
const viewsPath = '/foo/bar';
const defaultObject = new Defaults(object, viewsPath);

//Examples
const componentsDir = '/baz/';
const rootPath      = '/foo/bar/';
const backupLayout  = '<template><!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script></head><body>{{{app}}}{{{script}}}</body></html></template><script></script><style></style>';
const defaultLayout = '/foo/bar/qux';

test('Components Directory', t => {
    t.is(defaultObject.componentsDir, componentsDir);
});

test('Root Path', t => {
    t.is(defaultObject.rootPath, rootPath);
});

test('Backup Layout', t => {
    t.is(defaultObject.backupLayout, backupLayout);
});

test('Default Layout', t => {
    t.is(defaultObject.defaultLayout, defaultLayout);
});
