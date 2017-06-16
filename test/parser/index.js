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
    return Parser.componentParser(component, defaultObject, types.COMPONENT)
    .then(function(layout) {
        t.pass();
    })
    .catch(function(error) {
        t.fail(error)
    })
});

test('it should parse layout', t => {
    return Parser.layoutParser('', defaultObject, types.LAYOUT)
    .then(function(layout) {
        t.pass();
    })
    .catch(function(error) {
        t.fail('it cant parse layouts' + error);
    })
});

test('it should parse both components and layout', t =>  {
    return Promise.all(componentArray).then(function(components) {
        renderHtmlUtil(components, defaultObject).then(function(html) {
            t.pass();
        }).catch(function(error) {
            t.fail('it cant parse components' + error);
        });
    }, function(error) {
        t.fail('it cant parse components' + error);
    });
});

test.cb('it should parse html', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        const htmlRegex = /(<template.*?>)([\s\S]*)(<\/template>)/gm;
        const html = Parser.htmlParser(content, htmlRegex, true);
        t.is(html, '<div class=""><h1>{{message}}</h1></div>');
        t.end();
    })
});

test.cb('it should parse style', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }

        const style = Parser.styleParser(content);
        t.is(style, '.test{color:#00f}');
        t.end();
    })
});

test.cb('it should parse scripts', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        const script = Parser.scriptParser(content, defaultObject, types.SUBCOMPONENT)
        t.is(script.props[0], 'message');
        t.end();
    })
})
