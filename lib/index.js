'use strict';

const fs = require('fs');
const bodyRegx = /(<template>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex = /(export default {)([\s\S]*?)(^};?$)/gm;
const dataRegex = /(\'\$parent\').(\w*)/gm;
const layoutRegex = /{{{body}}}/igm;
let defaults = {
    layoutsDir: '/app/components/',
    defaultLayout: 'layout',
    options: undefined
};

function expressVue(filePath, options, callback) {

    defaults = options.settings.vue;
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue';
    defaults.options = options;

    Promise.all([layoutParser(defaults.layoutPath), templateParser(filePath)]).then(function(data) {
        const layout = data[0];
        const template = data[1];
        const html = layout.replace(layoutRegex, template);

        callback(null, html);
    }, function(error) {
        callback(new Error(error));
    });
}

function bodyParser(body) {
    let bodyString = body.match(bodyRegx)[0];
    if (bodyString) {
        bodyString = bodyString.replace(bodyRegx, '$2');
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

function layoutParser(layoutPath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(layoutPath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            const contentString = content.toString();
            const body   = bodyParser(contentString);
            const script = scriptParser(contentString);

            const layout = body.replace('{{{script}}}','<script>new Vue('+ script +')</script>');

            resolve(layout);
        });
    });
}

function templateParser(template) {
    return new Promise(function(resolve, reject) {
        fs.readFile(template, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            const contentString = content.toString();
            const body   = bodyParser(contentString);
            const script = scriptParser(contentString);

            const template = body + '<script>new Vue('+ script +')</script>';

            resolve(template);
        });
    });
}

export default expressVue;
