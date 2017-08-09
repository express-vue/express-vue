'use strict';

var ExpressVueRenderer = require('express-vue-renderer');

//This is the Middlewarein express-vue this wont be in the file
function init(options) {
    //Make new object
    var Renderer = new ExpressVueRenderer(options);
    //Middleware init
    return function (req, res, next) {
        //Res RenderVUE function
        res.renderVue = function (componentPath) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var vueOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            res.set('Content-Type', 'text/html');
            Renderer.renderToStream(componentPath, data, vueOptions).then(function (stream) {
                stream.on('data', function (chunk) {
                    return res.write(chunk);
                });
                stream.on('end', function () {
                    return res.end();
                });
            }).catch(function (error) {
                console.error(error);
                res.send(error);
            });
        };
        return next();
    };
}

module.exports.init = init;