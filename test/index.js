const test = require("ava");
const ExpressVue = require("../lib");
const path = require("path");

let vueOptions = {};
let expressVueMiddleware = {};
let data = {};
let vue = {};
let exampleResponse = "";
let exampleError = "";

test.beforeEach(t => {

    vueOptions = {
        rootPath: path.join(__dirname, "example/views"),
        babel: {
            "presets": [
                ["env", {
                    "targets": {
                        "browsers": ["last 2 versions"],
                    },
                }],
            ],
        },
    };
    expressVueMiddleware = ExpressVue.init(vueOptions);

    data = {
        title: "pageTitle",
        message: "Hello!",
        users: [],
    };

    vue = {
        head: {
            title: "pageTitle",
            metas: [{
                    property: "og:title",
                    content: "pageTitle",
                },
                {
                    name: "twitter:title",
                    content: "pageTitle",
                },
            ],
        },
    };

    exampleResponse = `<!DOCTYPE html><html><head>
<title>pageTitle</title>
<meta property="og:title" content="pageTitle"/>
<meta name="twitter:title" content="pageTitle"/>
<style>.test{color:pink;font-size:20px}</style></head><body><div id="app"><div data-server-rendered="true"><h1>pageTitle</h1><p>Welcome to the pageTitle demo. Click a link:</p><button type="button" name="button">Say FOO</button> <input placeholder="edit me" value="Hello!"><div><h1>Hello!</h1></div><div><ul></ul></div></div></div><script>(function(){"use strict";var e=function(){return new Vue({mixins:[{methods:{hello:function(){console.log('Hello')}}}],data:function(){return{"title":"pageTitle","message":"Hello!","users":[]}},components:{messageComp:{props:["message"],template:"<div class=\\"\\"><h1>{{message}}</h1></div>",inject:{}},users:{props:["users","title"],template:"<div class=\\"\\"><ul><li v-for=\\"user in users\\"><a v-bind:href=\\"'/users/' + user.name\\" class=\\"test\\">{{ user.name }}</a></li></ul></div>",inject:{}}},styles:".test{color:pink;font-size:20px}",template:"<div><h1>{{title}}</h1><p>Welcome to the {{title}} demo. Click a link:</p><button type=\\"button\\" name=\\"button\\" v-on:click=\\"hello\\">Say FOO</button> <input v-model=\\"message\\" placeholder=\\"edit me\\"><message-comp :message=\\"message\\"></message-comp><users :users=\\"users\\"></users></div>"})};typeof module!=='undefined'&&module.exports?(module.exports=e):(this.app=e())}).call(this),app.$mount('#app')</script></body></html>`;

    exampleError = `ENOENT: no such file or directory, stat '${vueOptions.rootPath}/indexfake'`;
});

test.cb("renders App object", t => {

    let req = {};
    let res = {
        response: "",
        set: function(key, value) {
            this[key] = value;
        },
        write: function(chunk) {
            this.response += chunk;
        },
        send: function(message) {
            // tslint:disable-next-line:no-console
            console.log(message);
        },
        end: function() {
            t.is(this.response, exampleResponse);
            t.end();
        },
    };

    // tslint:disable-next-line:no-shadowed-variable
    function next(error, req, res) {
        if (error) {
            t.fail(error);
        }
        t.end();
    }
    expressVueMiddleware(req, res, next);
    res.renderVue("index.vue", data, vue);
});

test.cb("renders App string", t => {

    let req = {};
    let res = {
        response: "",
        set: function(key, value) {
            this[key] = value;
        },
        write: function(chunk) {
            this.response += chunk;
        },
        send: function(message) {
            // tslint:disable-next-line:no-console
            console.log(message);
        },
        end: function() {
            t.is(this.response, exampleResponse);
            t.end();
        },
    };

    // tslint:disable-next-line:no-shadowed-variable
    function next(error, req, res) {
        if (error) {
            t.fail(error);
        }
        t.end();
    }
    expressVueMiddleware(req, res, next);
    res.renderVueString("index.vue", data, vue);
});

test.cb("tests error", t => {

    let req = {};
    let res = {
        response: "",
        set: function(key, value) {
            this[key] = value;
        },
        write: function(chunk) {
            this.response += chunk;
        },
        send: function(error) {
            t.is(error.message, exampleError);
            t.end();
        },
        end: function() {
            t.fail();
            t.end();
        },
    };

    // tslint:disable-next-line:no-shadowed-variable
    function next(error, req, res) {
        if (error) {
            t.fail(error);
            t.end();
        }
    }
    expressVueMiddleware(req, res, next);
    res.renderVue("indexfake", data, vue);
});

test.cb("tests content type", t => {

    let req = {};
    let res = {
        response: "",
        set: function(key, value) {
            this[key] = value;
            t.is(key, "Content-Type");
            t.is(value, "text/html");
            t.end();
        },
        write: function(chunk) {
            this.response += chunk;
        },
        send: function(error) {
            t.is(error.message, exampleError);
            t.end();
        },
        // tslint:disable-next-line:no-empty
        end: function() {},
    };

    // tslint:disable-next-line:no-shadowed-variable
    function next(error, req, res) {
        if (error) {
            t.fail(error);
            t.end();
        }
    }
    expressVueMiddleware(req, res, next);
    res.renderVue("index.vue", data, vue);
});

test.cb("tests vueOptions", t => {

    let req = {};
    let res = {
        response: "",
        set: function(key, value) {
            this[key] = value;
        },
        write: function(chunk) {
            this.response += chunk;
        },
        // tslint:disable-next-line:no-empty
        send: function(error) {
        },
        // tslint:disable-next-line:no-empty
        end: function() {},
    };

    // tslint:disable-next-line:no-shadowed-variable
    function next(error, req, res) {
        if (error) {
            t.fail(error);
            t.end();
        }
    }
    expressVueMiddleware(req, res, next);

    t.is(typeof res.renderVue, "function");
    t.end();
});
