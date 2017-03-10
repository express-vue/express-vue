import test   from 'ava';
import {scriptToString} from '../../lib/utils';

const object = {
    'string': 'foo',
    'function': function() {
        return 'baz';
    },
    'array': ['one', 'two', 'three'],
    'object': {
        dog: true,
        cat: false
    },
    'number': 42,
    'boolean': true
}


const string = scriptToString(object);

//Tests
const hasString   = string.includes(`string: "foo"`);
const hasNumber   = string.includes(`number: 42`);
const hasArray    = string.includes(`array: ["one","two","three"]`);
const hasObject   = string.includes(`object: {dog: true,cat: false,}`);
const hasBoolean  = string.includes(`boolean: true`);
const hasFunction = string.includes(`function: function _function() {
        return 'baz';
    }`);
const hasFinal    = string === `{string: "foo",function: function _function() {
        return 'baz';
    },array: ["one","two","three"],object: {dog: true,cat: false,},number: 42,boolean: true,}`;

test('Has a String' , t => {
    t.is(hasString, true);
});

test('Has a Number' , t => {
    t.is(hasNumber, true);
});

test('Has a Array' , t => {
    t.is(hasArray, true);
});

test('Has a Object' , t => {
    t.is(hasObject, true);
});

test('Has a Boolean' , t => {
    t.is(hasBoolean, true);
});

test('Has a Function' , t => {
    t.is(hasFunction, true);
});

test('Has a Fully formed String' , t => {
    t.is(hasFinal, true);
});
