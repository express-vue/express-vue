import test from 'ava';
import {Defaults, Types} from '../../lib/defaults.js';
import {
    componentParser,
    layoutParser
} from '../../lib/parser';

let types    = new Types();
const component = __dirname + '/../component.vue';
const object  = {
    componentsDir:  __dirname + ''
};
const viewsPath = '/foo/bar';
const defaultObject = new Defaults(object, viewsPath);
defaultObject.options = {
    vue: {}
}
const componentArray = [
    layoutParser('', defaultObject, types.LAYOUT),
    componentParser(component, defaultObject, types.COMPONENT)
];

test('it should parse components', t => {
    Promise.all(componentArray).then(function(components) {
        renderHtmlUtil(components, defaultObject).then(function(html) {
            t.pass();
        }).catch(function(error) {
            t.fail('it cant parse components' + error);
        });
    }, function(error) {
        t.fail('it cant parse components' + error);
    });
});
