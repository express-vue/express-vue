import test from 'ava';
import fs from 'fs';
import {Defaults, Types} from '../../lib/models';
import * as Parser from '../../lib/parser';
import {renderHtmlUtil} from '../../lib/utils';

let types    = new Types();
const component = __dirname + '/../component.vue';
const defaults = {
    settings: {
        vue: {
            componentsDir: '',
            defaultLayout: 'qux'
        },
        views: '/foo/bar'
    }
};

const defaultObject = new Defaults(defaults);
defaultObject.options = {
    vue: {}
}
const componentArray = [
    Parser.layoutParser('', defaultObject, types.LAYOUT),
    Parser.componentParser(component, defaultObject, types.COMPONENT)
];

test('it should parse components', t => {
    Parser.componentParser(component, defaultObject, types.COMPONENT)
    .then(function(layout) {
        t.pass();
    })
    .catch(function(error) {
        t.fail(error)
    })
});

test('it should parse layout', t => {
    Parser.layoutParser('', defaultObject, types.LAYOUT)
    .then(function(layout) {
        t.pass();
    })
    .catch(function(error) {
        t.fail('it cant parse layouts' + error);
    })
});

test('it should parse both components and layout', t =>  {
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

test('it should parse html', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        const html = Parser.htmlParser(content, true);
        t.is(html, '<div class=""><h1>{{message}}</h1></div>');
    })
});

test('it should parse scripts', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        const script = Parser.scriptParser(content, defaultObject, types.SUBCOMPONENT)
        t.is(script, '{ props: [ \'message\' ] }');
    })
})
