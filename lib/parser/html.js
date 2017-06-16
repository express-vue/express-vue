// @flow
import pug        from 'pug';
import htmlMinify from 'html-minifier';

const htmlRegex = /(<template.*?>)([\s\S]*)(<\/template>)/gm;

function htmlParser(body: string, regex: RegExp, minify: boolean) {
    if (!regex) {
        regex = htmlRegex;
    }
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
        bodyString = htmlMinify.minify(bodyString, {
            collapseWhitespace: true
        });
    }

    return bodyString;
}


export default htmlParser;
