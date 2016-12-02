'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scriptToString = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _xss = require('xss');

var _xss2 = _interopRequireDefault(_xss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scriptToString(script) {
    var string = '';
    for (var member in script) {
        switch (_typeof(script[member])) {
            case 'function':
                if (member === 'data') {
                    var dataObj = (0, _xss2.default)(JSON.stringify(script[member]()));
                    string += member + ': function(){return ' + dataObj + '},';
                } else {
                    string += member + ': ' + String(script[member]) + ',';
                }
                break;
            case 'object':
                if (member === 'data') {
                    string += member + ': ' + (0, _xss2.default)(JSON.stringify(script[member])) + ',';
                } else if (script[member].constructor === Array) {
                    string += member + ': ' + (0, _xss2.default)(JSON.stringify(script[member])) + ',';
                } else {
                    string += member + ': ' + scriptToString(script[member]) + ',';
                }
                break;
            default:
                string += member + ': ' + JSON.stringify(script[member]) + ',';
                break;
        }
    }
    return '{' + string + '}';
}

exports.scriptToString = scriptToString;