'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function scriptToString(script) {
    var string = '';
    for (var member in script) {
        switch (_typeof(script[member])) {
            case 'function':
                string += member + ': ' + String(script[member]) + ',';
                break;
            case 'string':
                string += member + ': ' + JSON.stringify(script[member]) + ',';
                break;
            case 'object':
                if (member === 'data') {
                    string += member + ': ' + JSON.stringify(script[member]) + ',';
                } else {
                    string += member + ': ' + scriptToString(script[member]) + ',';
                }
                break;

        }
    }
    return '{' + string + '}';
}

exports.scriptToString = scriptToString;