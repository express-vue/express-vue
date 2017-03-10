import test   from 'ava';
import {Defaults, Types, DataObject} from '../../lib/models';

const object  = {
    componentsDir: '/baz',
    defaultLayout: 'qux'
};
const viewsPath = '/foo/bar';
const types         = new Types();
const defaultObject = new Defaults(object, viewsPath);
const dataObject    = new DataObject(object, defaultObject, types.COMPONENT);
const dataObjectSub = new DataObject(object, defaultObject, types.SUBCOMPONENT);

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
