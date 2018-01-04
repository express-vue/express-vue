// @ts-checked
"use strict";
const Pronto = require("vue-pronto");

/**
 * Middleware Init function for ExpressVue
 * @param {Object} options
 * @returns {Function}
 */
function init(options) {
    //Make new object
    const Renderer = new Pronto(options);
    //Middleware init
    return function (req, res, next) {
        //Res RenderVUE function
        res.renderVue = function (componentPath) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var vueOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            res.set("Content-Type", "text/html");
            Renderer.RenderToStream(componentPath, data, vueOptions).then(function (stream) {
                stream.on("data", function (chunk) {
                    return res.write(chunk);
                });
                stream.on("end", function () {
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