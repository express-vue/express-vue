import test   from 'ava';
import expressVue from '../lib';
import {Defaults} from '../lib/models';
import {
    setupComponentArray,
    renderError
} from '../lib/utils';

const options = {
    settings: {
        vue: {
            componentsDir: '/test',
            defaultLayout: 'main'
        },
        views: '/test'
    }
};
const component = __dirname + '/component.vue';

const defaults = new Defaults(options);

test('Express Vue loads', t => {
    const isAFunction = typeof expressVue === 'function';

    t.is(isAFunction, true);
});

test('Renders Errors', t => {
    renderError('Test Error', function(error) {
        t.pass();
    })
});

test('Renders Component Promise Array', t => {
    const array = setupComponentArray(component, defaults);
    t.is(array.length, 2);
});

test('Express Vue Works', t => {
    expressVue('component', options, function(error, html) {
        if (error) {
            t.fail(error);
        } else {
            t.pass();
        }
    })
});
