// @flow
'use strict';

const ExpressVueRenderer = require('express-vue-renderer');

//This is the Middlewarein express-vue this wont be in the file
function init(options) {
    //Make new object
    const Renderer = new ExpressVueRenderer(options);
    //Middleware init
    return (req, res, next) => {
        //Res RenderVUE function
        res.renderVue = (componentPath, data = {}, vueOptions = {}) => {
            res.set('Content-Type', 'text/html');
            Renderer.renderToStream(componentPath, data, vueOptions)
                .then(stream => {
                    stream.on('data', chunk => res.write(chunk));
                    stream.on('end', () => res.end());
                })
                .catch(error => {
                    console.error(error);
                    res.send(error);
                });
        };
        return next();
    };
}

module.exports.init = init;