'use strict';

var fs = require('fs');

var bodyRegx = /(<template>)([\s\S]*?)(<\/template>)/gm;
var scriptRegex = /(export default {)([\s\S]*?)(};)/gm;
var dataRegex = /(\'\$parent\').(\w*)/gm;

module.exports = function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            return callback(new Error(err));
        }
        var contentString = content.toString();

        var bodyString = contentString.match(bodyRegx)[0]
            .replace(bodyRegx, '<div>$2</div>');
        var scriptString = contentString.match(scriptRegex)[0]
            .replace(scriptRegex, '({$2})');

        var script = scriptString.replace(dataRegex, function(match, p1, p2) {
            return JSON.stringify(options[p2]);
        });

        var head = '<head><script src="https://vuejs.org/js/vue.js"></script><title>'+ options.title +'</title></head>';
        var html = '<html>'+ head +'<body>'+ bodyString +'<script>new Vue('+ script +')</script></body></html>';

        return callback(null, html);
    });
};
