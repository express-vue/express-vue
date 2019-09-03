// @ts-check
"use strict";
const {ProntoVueify, ProntoWebpack} = require("vue-pronto");
const { GetConfig } = require("./utils/config.utils");
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
 * @prop {Object | boolean} webpack
 */

/**
 * Middleware Init function for ExpressVue
 * @param {ConfigObjectType} options
 * @param {Object} renderer
 * @returns {Function}
 */
function init(options, renderer) {
    //Make new object
    /**
     * @typedef Renderer
     * @prop {Function} [RenderToString]
     * @prop {Function} [RenderToStream]
     */
    /** @type {Renderer} */
    let Renderer = {};
    if (renderer) {
        Renderer = renderer;
    } else {
        console.warn("DEPRECATION WARNING: Please migrate to the Webpack Renderer!\nSee Documentation on Github for details");
        Renderer = new ProntoVueify(options);
    }

    /**
     * @param {Object} req
     * @param {Object} req.vueOptions
     * @param {Object} res
     * @param {Function} res.renderVue
     * @param {Function} res.renderVueString
     * @param {Function} res.set
     * @param {Function} res.write
     * @param {Function} res.end
     * @param {Function} res.send
     * @param {Function} next
     * @returns {void}
     */
    function expressVueMiddleware(req, res, next) {
        /**
         * @param {NodeJS.ReadableStream} stream
         * @returns {void}
         */
        function StreamToClient(stream) {
            stream.on(
                "data",
                /**
                 * @param {String} chunk
                 * @returns {Object}
                 */
                function(chunk) {
                    return res.write(chunk);
                },
            );
            stream.on("end", function() {
                return res.end();
            });
        }

        /**
         *
         * @param {string} str
         * @returns {void}
         */
        function StringToClient(str) {
            return res.send(str);
        }

        /**
         * @param {Error} error
         * @returns {void}
         */
        function ErrorToClient(error) {
            console.error(error);
            res.send(error);
        }

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
         * @returns {void}
         */
        res.renderVue = function(componentPath, data = {}, vueOptions = {}) {
            res.set("Content-Type", "text/html");
            Renderer.RenderToStream(componentPath, data, vueOptions)
                .then(StreamToClient)
                .catch(ErrorToClient);
        };

        /**
         * Res RenderVUEString function
         * @param {String} componentPath
         * @param {Object} [data={}]
         * @param {Object} [vueOptions={}]
         * @returns {void}
         */
        res.renderVueString = function(componentPath, data = {}, vueOptions = {}) {
            res.set("Content-Type", "text/html");
            Renderer.RenderToString(componentPath, data, vueOptions)
                .then(StringToClient)
                .catch(ErrorToClient);
        };

        return next();
    }

    //Middleware init
    return expressVueMiddleware;
}

/**
 * Takes an ExpressJS Instance and options and returns a promise
 * @param {Object} expressApp ExpressJS instance
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
async function use(expressApp, options = false) {
    if (!options) {
        const pwd = process.env.INIT_CWD || process.env.PWD || "";
        options = await GetConfig(pwd);
    }
    const renderer = new ProntoWebpack(options);
    await renderer.Bootstrap();
    const expressVue = init(options, renderer);
    expressApp.use(expressVue);

    expressApp.get(
        "/expressvue/bundles/*",
        // @ts-ignore
        function(req, res) {
            const fileUrl = req.baseUrl + req.path;
            const bundle = renderer.getBundleFile(fileUrl);
            if (!bundle) {
                res.status(404);
                res.send("file not found");
            } else {
                res.setHeader("Content-Type", "application/javascript");
                res.send(bundle);
            }
        },
    );
    return expressApp;
}

module.exports.init = init;
module.exports.use = use;
