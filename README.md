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

The idea is simple use Node+Express for your Controller and Models, and Vue.js for your Views.. you can have a secure server side rendered website without all the hassle. Your Controller will pass in the data to your View through

`res.renderVue('view', {data}, [{vueOptions}])`.

# Table of Contents

- [Installation](#installation)
- [Requirements](#requirements)
    - [ES Modules](#es-modules)
- [Example / Starter](#example--starter)
- [Usage](#usage)
    - [Options](#options)
        - [VueVersion](#vueversion)
    - [Components / Mixins / Etc](#components--mixins--etc)
    - [CSS Inside Components/Views](#css-inside-componentsviews)
    - [Mixins](#mixins)
    - [Meta](#meta)
        - [Structured Data](#structured-data)
    - [Template](#template)
- [Vue Dev Tools](#devtools)
- [Caching](#caching)
- [Finally](#finally)
- [Typescript Support](#typescript-support)
- [SailsJS Support](#sailsjs-support)
- [Migration to Webpack Renderer](#migration-to-webpack-renderer)
- [V5 Migration](#v5-migration)
- [Changelog](#changelog)


## Installation

```sh
$ npm install --save express-vue
```

## Requirements

Requires Node V6 or greater, and Vue 2.0 or greater. (Latest Vue.js is included in this project)

### ES Modules

If using ES module statments like

```js
export default {}
//or
import foo from "foo";
```

Or any other ES features you will need to also install `babel-core` and `babel-preset-env`.

```sh
npm i -D babel-core babel-preset-env
```

Then place a `.babelrc` file in your root. here's an example targeting last two versions

```json
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions"]
      }
    }]
  ]
}
```

## Example / Starter

An example / starter can be found [here](https://github.com/express-vue/express-vue-mvc-starter)

## Usage

This is the minimum required setup.
If you don't provide a `vueVersion` it will use the latest one when the project was published.
If there is no `rootPath` it will assume the root is the parent directory of `node_modules`.

```js
var expressVue = require("express-vue");
var app = express();

//pass your app through express-vue here
//expressVueOptions is optional and explained later in the docs
//this is a promise, so you can either await it or do this.
expressVue.use(app, expressVueOptions).then(() => {
    //the rest of your express routes.
});
```

In your route, assuming you have a main.vue

```js
router.get('/', (req, res, next) => {
    const data: {
        otherData: 'Something Else'
    };
    req.vueOptions: {
        head: {
            title: 'Page Title',
            metas: [
                { property:'og:title', content: 'Page Title'},
                { name:'twitter:title', content: 'Page Title'},
            ]
        }
    }
    res.renderVue('main.vue', data, req.vueOptions);
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
|rootPath|string|this is the path the library will use as the base for all lookups| optional| the directory that your `../node_modules` lives in|
|vueVersion|string or object|this is where you specify which version of vue.js's library to use from the CDN | optional| the latest version as of publishing this|
|layout|Object|this is the object for customzing the html, body, and template tags| optional| has default value which is in the example below|
|vue|Object|this is the global config for vue for example you can set a global title, or a script tag in your head block everything here is global|optional|no default value|
|data|Object|this is the global data object, this will be merged in to your .vue file's data block on every route, you can override this per route.|optional|no default value|

Here's an example, with the default layout config included for you to see...

```js
const vueOptions = {
    rootPath: path.join(__dirname, '../example/views'),
    head: {
        title: 'Hello this is a global title',
        scripts: [
            { src: 'https://example.com/script.js' },
        ],
        styles: [
            { style: '/assets/rendered/style.css' }
        ]
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
expressVue.use(app, vueOptions);
```

## Components / Mixins / Etc

### NOTE: Components and Mixins need to be OUTSIDE of the Pages Root folder.

When including components/mixins/etc the directory it looks is going to be relative to the file you're working in currently.
assuming the below is running in a folder with a subdirectory `components` and a directory `mixins` in a parent, it would look like this.
when importing .vue files and .js files from node modules you can just import them the normal way you import a module.

```html
<script>
import messageComp from './components/message-comp.vue';
import users from './components/users.vue';
import exampleMixin from '../mixins/exampleMixin';
import externalComponent from 'foo/bar/external.vue';
export default {
    mixins: [exampleMixin],
    data: function () {
        return {
        }
    },
    components: {
        messageComp,
        users,
        externalComponent
    }
}
</script>
```

## CSS inside components/views

Please use regular CSS for now, SCSS/LESS/etc are compiled languages, and this is a runtime library for now.
In the future I will be creating build tools to handle compiling the .vue files into .js files so that it runs faster,
and more efficient at runtime. But for dev mode, it will compile everything at runtime, so you can edit and preview faster.

```html
<style>
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
    head: {
        title: 'It will be a pleasure',
        // Meta tags
        metas: [
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
            // Rel
            { rel: 'icon', type: 'image/png', href: '/assets/favicons/favicon-32x32.png', sizes: '32x32' }
            // Generic rel for things like icons and stuff
        ],
        // Scripts
        scripts:[
            { src: '/assets/scripts/hammer.min.js' },
            { src: '/assets/scripts/vue-touch.min.js', charset: 'utf-8' },
            // Note with Scripts [charset] is optional defaults to utf-8
            // ...
        ],
        // Styles
        styles: [
            { style: '/assets/rendered/style.css' }
            { style: '/assets/rendered/style.css', type: 'text/css' }
            // Note with Styles, [type] is optional...
            // ...
        ],
    }
}
expressVue.use(app, vueOptions);
```

## Structured Data

This also supports Google Structured data
https://developers.google.com/search/docs/guides/intro-structured-data


```js
const vueOptions = {
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
```
## Template

If you want to have a custom layout you can, here is the default layout, each part is overridable.

```js
const vueOptions = {
    //...
    template: {
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
expressVue.use(app, vueOptions);
```


## DevTools

To use the amazing Vue.js DevTools please set the environment variable `VUE_DEV=true`this will also trigger the development version of vue to be included in the head.

## Caching

Caching is now enabled by default, in dev mode hopefuly you're using something like nodemon/gulp/grunt etc, which restarts the server on file change.. otherwise you will need to stop and restart the server if you change your files.. which is normal.

## Typescript support

Typescript declarations are published on NPM, so you don’t need external tools like Typings, as declarations are automatically imported with express-vue. That means all you need is a simple:

```js
import expressVue = require('express-vue');
```

## Sailsjs Support

This is middleware now so support for sails should just work as middleware.

## Migration to Webpack Renderer

- change `rootPath` to `pagesPath`
- remove `vueVersion`
- install `webpack` `vue-loader` and `css-loader`
- remove `.babelrc` if you have one
- if you're using regular babel packages switch to the `@babel` versions `@babel/core @babel/preset-env @babel/preset-es2015`
- remove vuejs
- move your expressVue options into a file on the root of your directory (same level as node_modules) and call it `expressvue.config.js`
- Use the new init syntax `expressVue.use(expressApp);` this is a async function, so please either await it or use it in a promise.


## V5 Migration

- Ditched the custom parser/renderer and moved to using `vue-pronto` which uses `Vueify`
- Re-structured the vueOptions
- Added `req.vueOptions` as a global.
- Removed the vue parent object with the child of head, this was un-needed its now just `vueOptions.head` instead of `vueOptions.vue.head`
- When using `res.renderVue` the filename requires an extention now.
- Paths are now RELATIVE to the file you're currently in ... YAAAY
- Node Modules are supported, for both javascript and vue file imports inside .vue files ... YAAAY
- Massive Performance gains
- 100% compatability with vueJS
- Migration to Vue-Pronto

Express-vue-renderer got too heavy, the architecture became too messy, and it was slow. It needed to get thrown out. Enter vue-pronto it uses vueify under the hood, and is much more modular. this will be much easier going forward to maintain.

### Changes to the Vue Options Object

There's been some big changes to this object, so before it would look like this

```js
const vueOptions = {
    vue: {
        head: {
            meta: [
                { script: 'https://unpkg.com/vue@2.4.2/dist/vue.js'},
                { name: 'application-name', content: 'Name of my application' },
                { name: 'description', content: 'A description of the page', id: 'desc' },
                { style: '/assets/style.css' }
            ]
        }
    }
};
```
### Now its different ..

- We have automated getting vueJS from the CDN for you, and which version (dev/prod) it should use based on the environment variable `VUE_DEV`.
- We also broke up the meta object, into metas, scripts, and styles arrays.
scripts now have scriptSrc which is a string including the <script> elements which will be placed in your head as is.
- The parent vue object that wraps the head object was unneeded and removed.
here's the same as above but newer

```js
const vueOptions = {
    vueOptions: "2.4.2",
    head: {
        metas: [
            { name: 'application-name', content: 'Name of my application' },
            { name: 'description', content: 'A description of the page', id: 'desc' },
        ],
        styles: [
            { style: '/assets/style.css' }
        ]
    }
};
```
### Vue File changes

Routes before were relative to the `rootPath`... now that is gone... routes for requires are relative to the file you are currently in.
Also `node_module` paths are working for both .js and .vue includes

### Remember to look at this if you're getting errors!

**`res.renderVue` Changes**

`res.renderVue` now requires an extension for the file you're using in the route. `foo/bar` now `foo/bar.vue`

### New

Global `req.vueOptions`. this is super handy for passing options around between middleware.

## Changelog

#### V5
- Ditched the custom parser/renderer and moved to using `vue-pronto` which uses Vueify
- Re-structured the vueOptions
- Added req.vueOptions as a global.
- Removed the vue parent object with the child of head, this was un-needed its now just vueOptions.head instead of vueOptions.vue.head
- when using `res.renderVue` the filename requires an extention now.
- Paths are now RELATIVE to the file you're currently in ... YAAAY
- Node Modules are supported, for both javascript and vue file imports inside .vue files ... YAAAY
- Massive Performance gains
- 100% compatability with vueJS

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
