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
    return pathArr.join('/').toString();
}


function getCorrectPathForFile(path: string, type: string) {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK | fs.constants.R_OK, (error) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.access(getParamCasePath(path), fs.constants.F_OK | fs.constants.R_OK, (err) => {
                        let paramCasePath = '';
                        if (err) {
                            reject(new Error(`Could not find ${type} file at ${paramCasePath.length > 0 ? paramCasePath : path}`));
                        } else {
                            paramCasePath = getParamCasePath(path);
                            resolve({path: paramCasePath, type: type});
                        }
                    });
                }
            } else {
                resolve({path: path, type: type});
            }
        });
    });
}

export {
    getParamCasePath,
    getCorrectPathForFile,
};
