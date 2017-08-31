<p align="center"><img width="150"src="http://i.imgur.com/qs9EUdv.png"></p>

<p align="center">
<a href="https://npmjs.org/package/express-vue"><img src="https://badge.fury.io/js/express-vue.svg" alt="Version"></a>
<a href="https://travis-ci.org/express-vue/express-vue"><img src="https://travis-ci.org/express-vue/express-vue.svg?branch=master" alt="Build Status"></a>
<a href="https://david-dm.org/express-vue/express-vue"><img src="https://david-dm.org/express-vue/express-vue.svg?theme=shields.io" alt="Dependency Status"></a>
<a href="https://codecov.io/gh/express-vue/express-vue"><img src="https://codecov.io/gh/express-vue/express-vue/branch/master/graph/badge.svg" alt="Codecov" /></a>
<a href="https://lima.codeclimate.com/github/express-vue/express-vue"><img src="https://lima.codeclimate.com/github/express-vue/express-vue/badges/gpa.svg" /></a>
<a href="https://greenkeeper.io"><img src="https://badges.greenkeeper.io/express-vue/express-vue.svg" /></a>
</p>


# express-vue

A Simple way of using Server Side rendered Vue.js 2.0+ natively in Express using streams

If you want to use vue.js and setup a large scale web application that is server side rendered, using Node+Express, but you want to use all the fantastic tools given to you by Vue.js. Then this is the library for you.

The idea is simple use Node+Express for your Controller and Models, and Vue.js for your Views.. you can have a secure server side rendered website without all the hassle. Your Controller will pass in the data to your View through `res.renderVue('view', {data}, [{vueOptions}])`.


## Installation

```sh
$ npm install --save express-vue
```

## Requirements

Requires Node V6 or greater, and Vue 2.0 or greater. (Latest Vue.js is included in this project)

## Example / Starter

An example / starter can be found [here](https://github.com/express-vue/express-vue-mvc-starter)

## Usage

```js
var expressVue = require('express-vue');

var app = express();
const vueOptions = {
    rootPath: path.join(__dirname, '../example/views'),
    layout: {
        start: '<div id="app">',
        end: '</div>'
    }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);
```

In your route, assuming you have a main.vue

```js
router.get('/', (req, res, next) => {
    const data: {
        otherData: 'Something Else'
    };
    const vueOptions: {
        head: {
            title: 'Page Title',
            meta: [
                { property:'og:title', content: 'Page Title'},
                { name:'twitter:title', content: 'Page Title'},
            ]
        }    
    }
    res.renderVue('main', data, vueOptions);
})
```

To use Data binding into the vue files you need to pass data in through the `data` object as above.
express-vue will automatically add anything you put here to the root element of your Vue components.
You do not need to have anything in data in your .vue file, but if you did what you put in res.render
will overwrite it.

### Remember to always write your data objects in your .vue files as functions!

## Options

|key|type|description|required?|default value|
|-|-|-|-|-|
|rootpath|string|this is the path the library will use as the base for all lookups| required| no default value|
|layout|Object|this is the object for customzing the html, body, and template tags| optional| has default value which is in the example below|
|vue|Object|this is the global config for vue for example you can set a global title, or a script tag in your head block everything here is global|optional|no default value|
|data|Object|this is the global data object, this will be merged in to your .vue file's data block on every route, you can override this per route.|optional|no default value|

Here's an example, with the default layout config included for you to see... note `rootPath` has no default value, and will crash if you don't set it.

**note**, its very wise to set a version of vue in your `vue.head.meta` array an example is in the one below.
if you don't add this, you wont see vue.js included in your head. This will be made automatic later, but for now you are in control of including vue.js in a `script` object in your `meta` array

```js
const vueOptions = {
    rootPath: path.join(__dirname, '../example/views'),
    layout: {
        html: {
            start: '<!DOCTYPE html><html>',
            end: '</html>'
        },
        body: {
            start: '<body>',
            end: '</body>'
        }
        template: {
            start: '<div id="app">',
            end: '</div>'
        }
    },
    vue: {
        head: {
            title: 'Hello this is a global title',
            meta: [
                { script: 'https://unpkg.com/vue' },
                { style: '/assets/rendered/style.css' }
            ]
        }
    },
    data: {
        foo: true,
        bar: 'yes',
        qux: {
            id: 123,
            baz: 'anything you wish, you can have any kind of object in the data object, it will be global and on every route'
        }
    }
};
const expressVueMiddleware = expressVue.init(vueOptions);
```

## Components / Mixins / Etc

When including components/mixins/etc the directory it looks is going to be relative to your `rootPath` you set in the options

```html
<script>
import messageComp from './components/message-comp.vue';
import users from './components/users.vue';
import exampleMixin from '../mixins/exampleMixin';
export default {
    mixins: [exampleMixin],
    data: function () {
        return {
        }
    },
    components: {
        messageComp: messageComp,
        users: users
    }
}
</script>
```

## CSS inside components/views

Please use regular CSS for now, SCSS/LESS/etc are compiled languages, and this is a runtime library for now.
In the future I will be creating build tools to handle compiling the .vue files into .js files so that it runs faster,
and more efficient at runtime. But for dev mode, it will compile everything at runtime, so you can edit and preview faster.

```html
<style lang="css">
    .test {
        border: 2px;
    }
    .test a {
        color: #FFF;
    }
</style>
```

## Mixins

You can now use Mixins, lets say you have an file called `exampleMixin.js` and it looks like this:

`examplemixin.js`
```js
module.exports {
    methods: {
        hello: function () {
            console.log('Hello');
        }
    }
}
```

In your route you would declare it by placing `mixins: [exampleMixin]` in your vue object.

```html
<script>
import exampleMixin from '../mixins/exampleMixin';
export default {
    mixins: [exampleMixin],
    data: function () {
        return {
        }
    }
}
</script>
```
You can now use this in your .Vue file, like so

```html
<button @click="hello()">Click me and look at console logs</button>
```

## Meta

This library takes the wonderful inspiration from [vue-head](https://github.com/ktquez/vue-head) and adapts it to
work here. Just add a `meta` array into your `head` object, with support for both `content` and `property` types.
(Note we don't support shorthand here, and no support for google+ just yet, that will come soon).

```js
const vueOptions = {
    vue: {
        head: {
            title: 'It will be a pleasure',
            // Meta tags
            meta: [
                { name: 'application-name', content: 'Name of my application' },
                { name: 'description', content: 'A description of the page', id: 'desc' } // id to replace intead of create element
                // ...
                // Twitter
                { name: 'twitter:title', content: 'Content Title' },
                // ...
                // Facebook / Open Graph
                { property: 'fb:app_id', content: '123456789' },
                { property: 'og:title', content: 'Content Title' },
                // ...
                // Scripts
                { script: '/assets/scripts/hammer.min.js' },
                { script: '/assets/scripts/vue-touch.min.js', charset: 'utf-8' },
                // Note with Scripts [charset] is optional defaults to utf-8
                // ...
                // Styles
                { style: '/assets/rendered/style.css' }
                { style: '/assets/rendered/style.css', type: 'text/css' }
                // Note with Styles, [type] is optional...
                // ...
                // Rel
                { rel: 'icon', type: 'image/png', href: '/assets/favicons/favicon-32x32.png', sizes: '32x32' }
                // Generic rel for things like icons and stuff
            ],
        }
    }
}
const expressVueMiddleware = expressVue.init(vueOptions);
```

## Structured Data

This also supports Google Structured data
https://developers.google.com/search/docs/guides/intro-structured-data


```js
const vueOptions = {
    vue: {
        head: {
            title: 'It will be a pleasure',
            structuredData: {
                "@context": "http://schema.org",
                "@type": "Organization",
                "url": "http://www.your-company-site.com",
                "contactPoint": [{
                    "@type": "ContactPoint",
                    "telephone": "+1-401-555-1212",
                    "contactType": "customer service"
                }]
            }
        }
    }
}
```


## DevTools

To use the amazing Vue.js DevTools please set the environment variable `VUE_DEV=true`
You'll also need to use the non-production version of vue, here's an example on how you can switch between the two based on a environment variable like `VUE_DEV` or better yet, the official one that express uses `NODE_ENV='production'` [(highly reccomended click here for why)](https://expressjs.com/en/advanced/best-practice-performance.html#set-nodeenv-to-production)

```js
var expressVue = require('express-vue');

var app = express();

//Latest non-production version of vue as of writing this doc, 
//you can go to https://unpkg.com/vue/ to find the latest version
//check the vuejs.org docs for more info
let vueScript = 'https://unpkg.com/vue@2.4.2/dist/vue.js';

if (process.env.NODE_ENV === 'production') {
    //its production so use the minimised production build of vuejs
    vueScript = 'https://unpkg.com/vue';
}

const vueOptions = {
    rootPath: path.join(__dirname, '../example/views'),
    vue: {
        head: {
            meta: [{ script: vueScript }]
        }
    }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);
```
## Caching

Caching is now enabled by default, in dev mode hopefuly you're using something like nodemon/gulp/grunt etc, which restarts the server on file change.. otherwise you will need to stop and restart the server if you change your files.. which is normal.

## Layout

If you want to have a custom layout you can, here is the default layout, each part is overridable.

```js
const vueOptions = {
    //...
    layout: {
        html: {
            start: '<!DOCTYPE html><html>',
            end: '</html>'
        },
        body: {
            start: '<body>',
            end: '</body>'
        }
        template: {
            start: '<div id="app">',
            end: '</div>'
        }
    }
    //...
};
const expressVueMiddleware = expressVue.init(vueOptions);
```


## Finally

Finally you'll need to set the link to your copy of vue.js in the options like so

```js
const vueOptions = {
    vue: {
        head: {
            meta: [{
                    script: 'https://unpkg.com/vue@2.4.2/dist/vue.js'
                }
            ]
        }
    }
};
```

or alternativly

```js
vueOptions.vue.head.meta.push({ script: 'https://unpkg.com/vue@2.4.2/dist/vue.js'});
```

the reasoning for doing this is that you can control which version of vue you're using, and you can swap which version of vue depending on however you like. If you've read this far you've seen the example i gave for switching between the two versions.

## Typescript support

Typescript declarations are published on NPM, so you don’t need external tools like Typings, as declarations are automatically imported with express-vue. That means all you need is a simple:

```js
import expressVue = require('express-vue');
```

## Sailsjs Support

This is middleware now so support for sails should just work as middleware.

## Changelog

#### V4
- v4 was a complete re-write.. migrating from v3 to v4 will break everything.
- No longer is res.render used, its now res.renderVue
- Now replies with streams instead of a single sync call
- massive performance increase
- import vue components in your vue files!
- lots of other changes

#### V3
- v3 has seriously changed the object you pass into the vue file.. so please if migrating from
an earlier version (and you should). Take the time to look at the new object. Sorry for the breaking change, but I'm only one person.

## License

Apache-2.0 © [Daniel Cherubini](https://cherubini.casa)


[daviddm-image]: https://david-dm.org/express-vue/express-vue.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/express-vue/express-vue
[coveralls-image]: https://coveralls.io/repos/express-vue/express-vue/badge.svg
[coveralls-url]: https://coveralls.io/r/express-vue/express-vue
