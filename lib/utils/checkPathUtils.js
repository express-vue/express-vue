// @flow
import fs from 'fs';
import paramCase from 'param-case';

function getParamCasePath(path: string): string {
    // example /Users/foo/code/test/components/componentFile.vue
    let pathArr = path.split('/');

    // gets the last element componentFile.foo
    let fileName = pathArr[pathArr.length - 1];

    // gets the actual file name componentFile
    let newFileName = fileName.split('.vue')[0];

    // paramcases componentFile to component-file and adds. .vue at the end
    let paramCaseFile = paramCase(newFileName) + '.vue';

    // replaces last element of the array, with the param'd version of the filename
    pathArr[pathArr.length - 1] = paramCaseFile;

    // returns joined pathname with slashes
    return pathArr.join('/');
}

function getCorrectPathForFile(path: string, type: string): string {
    let paramCasePath = '';
    if (fs.existsSync(path)) {
        return path;
    } else if (fs.existsSync(getParamCasePath(path))) {
        paramCasePath = getParamCasePath(path);
        return paramCasePath;
    } else {
        let err = `Could not find ${type} file at ${paramCasePath.length > 0 ? paramCasePath : path}`;
        throw new Error(err);
    }
}

export {
    getParamCasePath,
    getCorrectPathForFile,
};
