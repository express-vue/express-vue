# express-vue-engine [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Vue rendering engine for Express.js

## Installation

```sh
$ npm install --save express-vue-engine
```

## Usage

```js
var expressVueEngine = require('express-vue-engine');

app.engine('vue', expressVueEngine);
app.set('view engine', 'vue');
```
## License

Apache-2.0 © [Daniel Cherubini](https://cherubini.casa)


[npm-image]: https://badge.fury.io/js/express-vue-engine.svg
[npm-url]: https://npmjs.org/package/express-vue-engine
[travis-image]: https://travis-ci.org/danmademe/express-vue-engine.svg?branch=master
[travis-url]: https://travis-ci.org/danmademe/express-vue-engine
[daviddm-image]: https://david-dm.org/danmademe/express-vue-engine.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/danmademe/express-vue-engine
[coveralls-image]: https://coveralls.io/repos/danmademe/express-vue-engine/badge.svg
[coveralls-url]: https://coveralls.io/r/danmademe/express-vue-engine
