// @flow
import fs      from 'fs';
import minify  from 'html-minifier';
import {DataObject, Types} from '../models';
import requireFromString from 'require-from-string';
import pug     from 'pug';

const htmlMinifier  = minify.minify;
const htmlRegex     = /(<template.*?>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex   = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;
const templateRegex = /\w*\.vue/g;

function htmlParser(body: string, minify: boolean) {
    const bodyArray    = body.match(htmlRegex) || [];
    let bodyString     = bodyArray[0];
    const templateLang = bodyString.replace(htmlRegex, '$1');
    if (bodyString) {
        bodyString = bodyString.replace(htmlRegex, '$2');
        if(templateLang.includes('lang="pug"') || templateLang.includes('lang="jade"')) {
            bodyString = pug.compile(bodyString,{})({});
        }
    }

    if (minify) {
        bodyString = htmlMinifier(bodyString, {
            collapseWhitespace: true
        });
    }

    return bodyString;
}


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

function scriptParser(script: string, defaults: Object, type: Types) {
    const options = {
        'presets': ['es2015']
    };
    const scriptArray = script.match(scriptRegex) || [];
    if (scriptArray.length === 0) {
        let error = `I had an error processing this script.\n${script}`;
        console.error(new Error(error));
        return null;
    }
    let scriptString  = scriptArray[0].replace(scriptRegex, '$2');
    let babelScript   = require('babel-core').transform(scriptString, options);
    let evalScript    = requireFromString(babelScript.code);
    let finalScript   = dataParser(evalScript.default, defaults, type);
    return finalScript;
}

function layoutParser(layoutPath: string, defaults: Object, type: Types) {
    return new Promise(function(resolve) {
        fs.readFile(layoutPath, 'utf-8', function (err, content) {
            if (err) {
                content = defaults.backupLayout;
                // let error = `Could not find the layout, I was expecting it to live here
                // ${layoutPath}
                // But I couldn't find it there ¯\_(ツ)_/¯
                // So I'm using the default layout`;
                // console.warn(error)
            }

            const body = htmlParser(content, false);
            content = content.replace(htmlRegex, '');
            const script = scriptParser(content, defaults, type);

            resolve({
                type: type,
                template: body,
                script: script
            });
        });
    });
}

function componentParser(templatePath: string, defaults: Object, type: Types) {
    return new Promise(function(resolve, reject) {
        fs.readFile(templatePath, 'utf-8', function (err, content) {
            if (err) {
                let error = `Could Not Find Component, I was expecting it to live here \n${templatePath} \nBut I couldn't find it there, ¯\\_(ツ)_/¯\n\n`;
                console.error(new Error(error));
                reject(error);
            } else {
                const body = htmlParser(content, true);
                content = content.replace(htmlRegex, '');
                const script = scriptParser(content, defaults, type);
                const templateArray = templatePath.match(templateRegex) || [];

                if (templateArray.length === 0) {
                    let error = `I had an error processing component templates. in this file \n${templatePath}`;
                    console.error(new Error(error));
                    reject(error);
                }

                let templateName = templateArray[0].replace('\.vue', '');
                let componentScript = script || {};
                componentScript.template = body;

                resolve({
                    type: type,
                    name: templateName,
                    script: componentScript
                });
            }
        });
    });
}

export {
    componentParser,
    layoutParser,
    scriptParser,
    dataParser,
    htmlParser
};
