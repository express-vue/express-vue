// @flow
const test = require('ava');
const expressVue = require('../lib');
const path = require('path');

const vueOptions = {
    rootPath: path.join(__dirname, '../example/views'),
    layout: {
        start: '<body><div id="app">',
        end: '</div></body>'
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

const exampleResponse = `<!DOCTYPE html><html><head><title>pageTitle</title>
<meta property="og:title" content="pageTitle"/>
<meta name="twitter:title" content="pageTitle"/>
</head><body><div id="app"><div data-server-rendered="true"><h1>pageTitle</h1><p>Welcome to the pageTitle demo. Click a link:</p><button type="button" name="button">Say FOO</button> <input placeholder="edit me" value="Hello!"><div><h1>Hello!</h1></div><div><ul></ul></div></div><script>
(function () {'use strict';var createApp = function () {return new Vue({mixins: [{methods: {hello: function () {
            console.log('Hello');
        },},},],data: function(){return {"title":"pageTitle","message":"Hello!","users":[]}},components: {messageComp: {props: ["message"],template: "<div class=\\"\\"><h1>{{message}}</h1></div>",},users: {props: ["users","title"],template: "<div class=\\"\\"><ul><li v-for=\\"user in users\\"><a v-bind:href=\\"'/users/' + user.name\\" class=\\"test\\">{{ user.name }}</a></li></ul></div>",},},template: "<div><h1>{{title}}</h1><p>Welcome to the {{title}} demo. Click a link:</p><button type=\\"button\\" name=\\"button\\" v-on:click=\\"hello\\">Say FOO</button> <input v-model=\\"message\\" placeholder=\\"edit me\\"><message-comp :message=\\"message\\"></message-comp><users :users=\\"users\\"></users></div>",})};if (typeof module !== 'undefined' && module.exports) {module.exports = createApp} else {this.app = createApp()}}).call(this);app.$mount('#app');
</script></div></body>`

const exampleError = `Could not find view file at ${vueOptions.rootPath}/indexfake.vue`;

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


test.cb('tests error', t => {

    let req = {}
    let res = {
        response: '',
        set: function (key, value) {
            this[key] = value;
        },
        write: function (chunk) {
            this.response += chunk;
        },
        send: function (error) {
            t.is(error.message, exampleError);
            t.end();
        },
        end: function () {
            t.fail();
            t.end();
        }
    }


    function next(error, req, res) {
        if (error) {
            t.fail(error);
            t.end();
        }
    }
    expressVueMiddleware(req, res, next)
    res.renderVue('indexfake', data, vue);
});


test.cb('tests content type', t => {

    let req = {}
    let res = {
        response: '',
        set: function (key, value) {
            this[key] = value;
            t.is(key, 'Content-Type');
            t.is(value, 'text/html');
            t.end();
        },
        write: function (chunk) {
            this.response += chunk;
        },
        send: function (error) {
            t.is(error.message, exampleError);
            t.end();
        },
        end: function () {}
    }

    function next(error, req, res) {
        if (error) {
            t.fail(error);
            t.end();
        }
    }
    expressVueMiddleware(req, res, next)
    res.renderVue('index', data, vue);
});