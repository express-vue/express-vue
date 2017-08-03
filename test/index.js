// @flow
const test = require('ava');
const expressVue = require('../lib');
const path = require('path');

const vueOptions = {
    rootPath: path.join(__dirname, '../example'),
    viewsPath: 'views',
    componentsPath: 'views/components',
    layout: {
        start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue@2.3.4/dist/vue.js"></script>',
        middle: '<body><div id="app">',
        end: '</div></body></html>'
    }
};
const expressVueMiddleware = expressVue.init(vueOptions);

const data = {
    title: 'pageTitle',
    message: 'Hello!',
    users: []
};

const vue = {
    head: {
        title: 'pageTitle',
        meta: [{
                property: 'og:title',
                content: 'pageTitle'
            },
            {
                name: 'twitter:title',
                content: 'pageTitle'
            }
        ]
    }
};

const exampleResponse = '<!DOCTYPE html><html><head><title>pageTitle</title>\n<meta property="og:title" content="pageTitle"/>\n<meta name="twitter:title" content="pageTitle"/>\n</head><!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue@2.3.4/dist/vue.js"></script><div data-server-rendered="true"><h1>pageTitle</h1><p>Welcome to the pageTitle demo. Click a link:</p><button type="button" name="button">Say FOO</button> <input placeholder="edit me" value="Hello!"><message-comp message="Hello!"></message-comp><users users=""></users></div><script>\n(function () {\'use strict\';var createApp = function () {return new Vue({data: function(){return {"title":"pageTitle","message":"Hello!","users":[]}},template: "<div><h1>{{title}}</h1><p>Welcome to the {{title}} demo. Click a link:</p><button type=\\"button\\" name=\\"button\\" v-on:click=\\"hello\\">Say FOO</button> <input v-model=\\"message\\" placeholder=\\"edit me\\"><message-comp :message=\\"message\\"></message-comp><users :users=\\"users\\"></users></div>",})};if (typeof module !== \'undefined\' && module.exports) {module.exports = createApp} else {this.app = createApp()}}).call(this);app.$mount(\'#app\');\n</script></div></body></html>';

test.cb('renders App object', t => {

    let req = {}
    let res = {
        response: '',
        set: function (key, value) {
            this[key] = value;
        },
        write: function (chunk) {
            this.response += chunk;
        },
        send: function (message) {
            console.log(message);
        },
        end: function () {
            t.is(this.response, exampleResponse);
            t.end();
        }
    }


    function next(error, req, res) {
        if (error) {
            t.fail(error);
        }
    }
    expressVueMiddleware(req, res, next)
    res.renderVue('index', data, vue);
});