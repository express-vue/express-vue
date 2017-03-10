import test   from 'ava';
import * as ExpressVue from '../lib';
import {Defaults} from '../lib/models';

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
    const isAFunction = typeof ExpressVue.expressVue === 'function';

    t.is(isAFunction, true);
});

test('Renders Errors', t => {
    ExpressVue.renderError('Test Error', function(error) {
        t.pass();
    })
});

test('Renders Component Promise Array', t => {
    const array = ExpressVue.setupComponentArray(component, defaults);
    t.is(array.length, 2);
});

test('Express Vue Works', t => {
    ExpressVue.expressVue('component', options, function(error, html) {
        if (error) {
            t.fail();
        } else {
            console.log(html);
            t.pass();
        }
    })
});
