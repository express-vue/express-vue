// @ts-check
"use strict";
const Pronto = require("vue-pronto");

/**
 * @typedef VueOptionsType
 * @prop {String} title
 * @prop {Object} head
 * @prop {Object[]} head.scripts
 * @prop {Object[]} head.metas
 * @prop {Object[]} head.styles
 * @prop {Object} template
 */

/**
 * @typedef ConfigObjectType
 * @prop {{max: number, maxAge: number}} cacheOptions - cacheoptions for LRU cache
 * @prop {String} rootPath
 * @prop {String} vueVersion
 * @prop {VueOptionsType} head
 */

/**
 * Middleware Init function for ExpressVue
 * @param {ConfigObjectType} options
 * @returns {Function}
 */
function init(options) {
    //Make new object
    const Renderer = new Pronto(options);

    /**
     * @param {Object} req
     * @param {Object} req.vueOptions
     * @param {Object} res
     * @param {Function} res.renderVue
     * @param {Function} res.set
     * @param {Function} res.write
     * @param {Function} res.end
     * @param {Function} res.send
     * @param {Function} next
     */
    function expressVueMiddleware(req, res, next) {
        req.vueOptions = {
            title: "",
            head: {
                scripts: [],
                styles: [],
                metas: [],
            },
        };
        /**
         * Res RenderVUE function
         * @param {String} componentPath
         * @param {Object} [data={}]
         * @param {Object} [vueOptions={}]
         */
        res.renderVue = function(componentPath, data = {}, vueOptions = {}) {
            res.set("Content-Type", "text/html");
            Renderer.RenderToStream(componentPath, data, vueOptions)
                .then(/** @param {Object} stream */function(stream) {
                    stream.on("data", /** @param {String} chunk */function(chunk) {
                        return res.write(chunk);
                    });
                    stream.on("end", function() {
                        return res.end();
                    });
                }).catch(/** @param {Error} error */function(error) {
                    console.error(error);
                    res.send(error);
                });
        };
        return next();
    }

    //Middleware init
    return expressVueMiddleware;
}

module.exports.init = init;
