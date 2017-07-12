// @flow
'use strict';

const {Defaults} = require('./models');
const expressVueRenderer = require('express-vue-renderer');

function init(options: Object) {
    //Make new object
    const GlobalOptions = new Defaults(options);
    //Middleware init
    return (req: Object, res: Object, next: Function) => {
        //Res RenderVUE function
        res.renderVue = (componentPath, data, vueOptions) => {
            res.set('Content-Type', 'text/html');
            expressVueRenderer.renderToStream(componentPath, data, vueOptions, GlobalOptions)
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
