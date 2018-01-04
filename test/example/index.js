const path = require('path');
const express = require('express');
const expressVue = require('../../src');
const app = express();

const vueOptions = {
    rootPath: path.join(__dirname, '/views'),
    layout: {
        start: '<body><div id="app">',
        end: '</div></body>'
    },
    head: {
        scripts: [
            { src: 'https://unpkg.com/vue@2.4.2/dist/vue.js' }
        ]
    }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

var users = [];
var pageTitle = 'Express Vue';
users.push({
    name: 'tobi',
    age: 12
});
users.push({
    name: 'loki',
    age: 14
});
users.push({
    name: 'jane',
    age: 16
});

var exampleMixin = {
    methods: {
        hello: function () {
            console.log('Hello');
        }
    }
};

app.get('/', function (req, res) {
    const data = {
        title: pageTitle,
        message: 'Hello!',
        users: users
    };

    const vue = {
        head: {
            title: pageTitle,
            metas: [{
                property: 'og:title',
                content: pageTitle
            },
            {
                name: 'twitter:title',
                content: pageTitle
            }, {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            }
            ],
            structuredData: {
                '@context': 'http://schema.org',
                '@type': 'Organization',
                'url': 'http://www.your-company-site.com',
                'contactPoint': [{
                    '@type': 'ContactPoint',
                    'telephone': '+1-401-555-1212',
                    'contactType': 'customer service'
                }]
            }
        }
    };
    res.renderVue('index.vue', data, vue);
});

app.get('/users/:userName', function (req, res) {
    var user = users.filter(function (item) {
        return item.name === req.params.userName;
    })[0];
    res.renderVue('user.vue', {
        title: 'Hello My Name is',
        user: user
    });
});

app.listen(3000);
console.log('Express server listening on port 3000');