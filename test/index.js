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
    return setupComponentArray(component, defaults)
    .then(array => {
        t.is(array.length, 2);
    })
    .catch(error => {
        t.fail(error);
    });

});

test.cb('Express Vue Works', t => {
    expressVue(__dirname +'/component', options, function(error, html) {
        if (error) {
            t.fail(error);
            t.end();
        } else {
            t.pass();
            t.end();
        }
    })
});
