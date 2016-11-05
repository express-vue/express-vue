
# express-vue [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Vue rendering engine for Express.js

## Installation

```sh
$ npm install --save express-vue
```

## Usage

```js
var expressVue = require('express-vue');

var app = express();
app.set('vue', {
    rootPath: __dirname + '/',
    layoutsDir: 'app/components/',
    componentsDir: 'components/',
    defaultLayout: 'layout'
});
app.engine('vue', expressVue);
app.set('view engine', 'vue');
```

In your route, assuming you have a main.vue

```js
router.get('/', (req, res, next) => {
    res.render('main', {
        data: {
            otherData: 'Something Else'
        },
        vue: {
            meta: {
                title: 'Page Title',
                head: [
                    { property:'og:title' content: 'Page Title'},
                    { name:'twitter:title' content: 'Page Title'},
                ]
            }    
        }
    });
})
```

To use Data binding into the vue files you need to pass data in through the `data` object as above.
express-vue will automatically add anything you put here to the root element of your Vue components.
You do not need to have anything in data in your .vue file, but if you did what you put in res.render
will overwrite it.

### Remember to always write your data objects in your .vue files as functions!

## Components

To add components to your .vue files you can either write them in manually.. or pass them in through res.render

```js
router.get('/', (req, res, next) => {
    res.render('main', {
        data : {
            otherData: 'Something Else'
        },
        vue: {
            meta: {
                title: 'Page Title',
            },
            components: ['myheader', 'myfooter']
        }

    });
})
```

This will trigger the library to look in the `componentsDir` folder for any component matching, it _MUST_ be an array

Then in your .vue file you can just use the element directive and it will work out of the box

```vue
<template>
    <div>
        <myheader></myheader>
        <h1>{{otherData}}</h1>
        <myfooter></myfooter>
    </div>
</template>
```

Note: This isn't available in the layout.vue file yet, only the .vue files you specify in your express route.

## Meta

This library takes the wonderful inspiration from [vue-head](https://github.com/ktquez/vue-head) and adapts it to
work here. Just add a `meta` array into your `head` object, with support for both `content` and `property` types.
(Note we don't support shorthand here, and no support for google+ just yet, that will come soon).

```js
head: {
    title: {
      inner: 'It will be a pleasure'
    },
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
    ],
}
```

## Example

A full example can be found at: [danmademe/express-vue-example](https://github.com/danmademe/express-vue-example)

## Requirements

It requires you to have a file called layout.vue file similar to this in the `app/components/` directory

It's required to set the `{{{app}}}` and `{{{script}}}` tags where you want the layout body and script to go.
If you want to set a title or other meta data, you can add them to the vue metadata object, you can look at the above
examples for how to do that.


Finally you'll need to set the link to your copy of vue.js in the script... (this will become automatic soon)

```vue
<template>
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <script src="assets/scripts/vue.js" charset="utf-8"></script>
        </head>
        <body>
            {{{app}}}
            {{{script}}}
            <script>app.$mount('#app')</script>
        </body>
    </html>
</template>

<script>
</script>

<style>
</style>
```

## Todo

- Have the style sections do something!

## License

Apache-2.0 © [Daniel Cherubini](https://cherubini.casa)


[npm-image]: https://badge.fury.io/js/express-vue.svg
[npm-url]: https://npmjs.org/package/express-vue
[travis-image]: https://travis-ci.org/danmademe/express-vue.svg?branch=master
[travis-url]: https://travis-ci.org/danmademe/express-vue
[daviddm-image]: https://david-dm.org/danmademe/express-vue.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/danmademe/express-vue
[coveralls-image]: https://coveralls.io/repos/danmademe/express-vue/badge.svg
[coveralls-url]: https://coveralls.io/r/danmademe/express-vue
