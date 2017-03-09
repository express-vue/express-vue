import test   from 'ava';
import expressVue from '../lib';

test('Express Vue loads', t => {
    const isAFunction = typeof expressVue === 'function';

    t.is(isAFunction, true);
});
