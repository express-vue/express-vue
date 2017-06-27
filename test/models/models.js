import test   from 'ava';
import {Defaults, Types, DataObject} from '../../lib/models';

const defaults = {
    layout: 'fooBar',
    settings: {
        vue: {
            componentsDir: '/baz',
            defaultLayout: 'qux'
        },
        views: '/foo/bar'
    }
};
const types         = new Types();
const defaultObject = new Defaults(defaults);
const dataObject    = new DataObject(defaults, defaultObject, types.COMPONENT);
const dataObjectSub = new DataObject(defaults, defaultObject, types.SUBCOMPONENT);
const emptyObject   = new Defaults({settings: {views:'/foo/bar'}});

//Examples
const exampleObject = {
  rootPath: '/foo/bar/',
  layoutsDir: '',
  componentsDir: '/baz/',
  customLayout: '/foo/bar/fooBar',
  defaultLayout: '/foo/bar/qux',
  options: {
      settings: {
          vue: {
              componentsDir: '/baz',
              defaultLayout: 'qux'
          },
          views: '/foo/bar'
      }
  },
  backupLayout: '<template><!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script></head><body>{{{app}}}{{{script}}}</body></html></template><script></script><style></style>',
  layoutPath: '/foo/bar/qux.vue'
};

test('Components Directory', t => {
    t.is(defaultObject.componentsDir, exampleObject.componentsDir);
});

test('Root Path', t => {
    t.is(defaultObject.rootPath, exampleObject.rootPath);
});

test('Backup Layout', t => {
    t.is(defaultObject.backupLayout, exampleObject.backupLayout);
});

test('Default Layout', t => {
    t.is(defaultObject.defaultLayout, exampleObject.defaultLayout);
});

test('layoutsDir', t => {
    t.is(defaultObject.layoutsDir, exampleObject.layoutsDir);
});

test('customLayout', t => {
    t.is(defaultObject.customLayout, exampleObject.customLayout);
});


//Empty
test('empty rootPath', t => {
    t.is(emptyObject.rootPath, '/foo/bar/');
});
test('empty layoutsDir', t => {
    t.is(emptyObject.layoutsDir, '');
});
test('empty componentsDir', t => {
    t.is(emptyObject.componentsDir, '');
});
test('empty defaultLayout', t => {
    t.is(emptyObject.defaultLayout, '');
});
test('empty options', t => {
    t.is(emptyObject.options.settings.views, '/foo/bar');
});
