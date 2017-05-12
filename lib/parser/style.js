// @flow

function styleParser(template: string, regex: RegExp): string {
    const styleArray = template.match(regex) || [];
    let styleString  = styleArray[0];
    let finalStyleString = '';
    if (styleString) {
        finalStyleString = styleString.replace(regex, '$2');

        const templateLang = styleString.replace(regex, '$1');
        if(templateLang.includes('lang="scss"') || templateLang.includes('lang="less"')) {
            console.error('Sorry please only use plain CSS in your files for now');
        }
    }

    return finalStyleString === '\n' ? '' : finalStyleString;
}

export default styleParser;
