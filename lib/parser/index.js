// @flow
import fs      from 'fs';

import {Types} from '../models';

import camelCase from 'camel-case';
import styleParser from './style';
import htmlParser from './html';
import scriptParser from './script';

const htmlRegex     = /(<template.*?>)([\s\S]*)(<\/template>)/gm;
const scriptRegex   = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;
const styleRegex    = /(<style.*?>)([\s\S]*?)(<\/style>)/gm;



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

            const body = htmlParser(content, htmlRegex, false);
            content = content.replace(htmlRegex, '');

            const script = scriptParser(content, defaults, type, scriptRegex);

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
                const body = htmlParser(content, htmlRegex, true);
                content = content.replace(htmlRegex, '');

                const script = scriptParser(content, defaults, type, scriptRegex);
                const templateArray = templatePath.split('/');

                const style = styleParser(content, styleRegex);
                content = content.replace(styleRegex, '');

                if (templateArray.length === 0) {
                    let error = `I had an error processing component templates. in this file \n${templatePath}`;
                    console.error(new Error(error));
                    reject(error);
                }

                let templateName = templateArray[templateArray.length - 1].replace('.vue', '');
                let componentScript = script || {};
                componentScript.template = body;

                resolve({
                    type: type,
                    style: style,
                    name: camelCase(templateName),
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
    styleParser,
    htmlParser
};
