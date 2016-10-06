'use strict';

var fs = require('fs');
var bodyRegx = /(<template>)([\s\S]*?)(<\/template>)/gm;
var scriptRegex = /(export default {)([\s\S]*?)(^};?$)/gm;
var dataRegex = /(\'\$parent\').(\w*)/gm;
var layoutRegex = /{{{body}}}/igm;
var defaults = {
    layoutsDir: '/app/components/',
    defaultLayout: 'layout'
}

module.exports = expressVue;

function expressVue(filePath, options, callback) {

    defaults = options.settings.vue;
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue'

    Promise.all([layoutParser(defaults.layoutPath), templateParser(filePath)]).then(function(data) {
        var layout = data[0];
        var template = data[1];
        var html = layout.replace(layoutRegex, template);
        callback(null, html);
    }, function(error) {
      callback(new Error(error))
    });
};

function bodyParser(body) {
    var bodyString = body.match(bodyRegx)[0]
    if (bodyString) {
        bodyString = bodyString.replace(bodyRegx, '$2');
    }
    return bodyString;
}

function scriptParser(script) {
    var scriptString = script.match(scriptRegex)[0]
    if (scriptString) {
        scriptString = scriptString.replace(scriptRegex, '({$2})')
        .replace(dataRegex, function(match, p1, p2) {
            return JSON.stringify(options[p2]);
        });
    }
    return scriptString
}

function layoutParser(layoutPath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(layoutPath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            var contentString = content.toString();
            var body   = bodyParser(contentString);
            var script = scriptParser(contentString);

            var layout = body.replace('{{{script}}}','<script>new Vue('+ script +')</script>')

            resolve(layout);
        });
    })
};

function templateParser(template) {
    return new Promise(function(resolve, reject) {
        fs.readFile(template, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            var contentString = content.toString();
            var body   = bodyParser(contentString);
            var script = scriptParser(contentString);

            var template = body + '<script>new Vue('+ script +')</script>';

            resolve(template);
        });
    })
}
