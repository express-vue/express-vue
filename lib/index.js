'use strict';

import minify from 'html-minifier'

const htmlMinifier = minify.minify;

const fs = require('fs');
const htmlRegex = /(<template>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex = /(export default {)([\s\S]*?)(^};?$)/gm;
const dataRegex = /(\'\$parent\').(\w*)/gm;
const layoutRegex = /{{{body}}}/igm;
const titleRegex = /{{{title}}}/igm;
let defaults = {
    layoutsDir: '/app/components/',
    defaultLayout: 'layout',
    options: undefined
};

function expressVue(componentPath, options, callback) {

    defaults = options.settings.vue;
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue';
    defaults.options = options;

    Promise.all([layoutParser(defaults.layoutPath, componentPath), componentParser(componentPath)]).then(function(data) {
        const layout = data[0];
        const template = data[1];
        const html = layout.replace(layoutRegex, template);

        callback(null, html);
    }, function(error) {
        callback(new Error(error));
    });
}

function htmlParser(body, minify) {
    let bodyString = body.match(htmlRegex)[0];
    if (bodyString) {
        bodyString = bodyString.replace(htmlRegex, '$2');
    }

    if (minify) {
        bodyString = htmlMinifier(bodyString, {
            collapseWhitespace: true
        });
    }

    return bodyString;
}

function scriptParser(script) {
    let scriptString = script.match(scriptRegex)[0];
    if (scriptString) {
        scriptString = scriptString.replace(scriptRegex, '({$2})')
        .replace(dataRegex, function(match, p1, p2) {
            return JSON.stringify(defaults.options[p2]);
        });
    }
    return scriptString;
}

function layoutParser(layoutPath, componentPath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(layoutPath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            const contentString = content.toString();
            const body   = htmlParser(contentString);
            const script = scriptParser(contentString);

            let componentScript = eval(script);

            componentParser(componentPath).then(function(component) {
                componentScript.components = {'myapp': component};
                const layout = body.replace('{{{script}}}','<script>new Vue('+ scriptToString(componentScript) +')</script>')
                .replace(titleRegex, componentScript.data().title);

                resolve(layout);
            })

        });
    });
}

function componentParser(template) {
    return new Promise(function(resolve, reject) {
        fs.readFile(template, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            const contentString = content.toString();
            const body   = htmlParser(contentString, true);
            const script = scriptParser(contentString);

            let componentScript = eval(script);
            componentScript.template = body;

            resolve(componentScript);
        });
    });
}

function scriptToString(script) {
    let string = ''
    for (let member in script) {
        switch (typeof script[member]) {
            case 'function':
                string += String(script[member]) + ','
                break;
            case 'string':
                string += member + ': ' + JSON.stringify(script[member]) + ','
                break;
            case 'object':
                string += member + ': ' + scriptToString(script[member]) + ','
                break;

        }
    }
    return `{${string}}`;
}

export default expressVue;
