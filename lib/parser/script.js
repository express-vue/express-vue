// @flow
import {DataObject, Types} from '../models';
import requireFromString from 'require-from-string';

const scriptRegex = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;

function dataParser(script: Object, defaults: Object, type: Types) {
    let finalScript = {};
    for (var element in script) {
        if (script.hasOwnProperty(element)) {
            if (element === 'data') {
                let data = new DataObject(script.data(), defaults.options.data, type).data;
                finalScript[element] = () => data;
            } else {
                finalScript[element] = script[element];
            }
        }
    }
    return finalScript;
}

function scriptParser(script: string, defaults: Object, type: Types, regex: RegExp) {
    if (!regex) {
        regex = scriptRegex;
    }
    const options = {
        'presets': ['es2015']
    };
    const scriptArray = script.match(regex) || [];
    if (scriptArray.length === 0) {
        let error = `I had an error processing this script.\n${script}`;
        console.error(new Error(error));
        return null;
    }
    let scriptString  = scriptArray[0].replace(regex, '$2');
    let babelScript   = require('babel-core').transform(scriptString, options);
    let evalScript    = requireFromString(babelScript.code);
    let finalScript   = dataParser(evalScript.default, defaults, type);
    return finalScript;
}

export default scriptParser;
