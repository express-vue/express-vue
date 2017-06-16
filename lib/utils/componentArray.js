// @flow
import {Defaults, Types} from '../models';
import {
    layoutParser,
    componentParser
} from '../parser';
import {getCorrectPathForFile} from './checkPathUtils';

let types = new Types();

function setupComponentArray(componentPath: string, defaults: Defaults) {
    return new Promise((resolve, reject) => {
        let array = [
            layoutParser(defaults.layoutPath, defaults, types.LAYOUT)
        ];
        let pathPromiseArray = [];

        getCorrectPathForFile(componentPath, 'view').then(path => {
            array.push(componentParser(path.path, defaults, types.COMPONENT));

            if (defaults.options.vue && defaults.options.vue.components) {
                for (let component of defaults.options.vue.components) {
                    const componentFile = defaults.componentsDir + component + '.vue';
                    pathPromiseArray.push(getCorrectPathForFile(componentFile, 'component'));
                }
            }
            Promise.all(pathPromiseArray)
                .then(pathObjArray => {
                    for (var pathObj of pathObjArray) {
                        array.push(componentParser(pathObj.path, defaults, types.SUBCOMPONENT));
                    }
                    resolve(array);
                })
                .catch(error => {
                    reject(error);
                });
        }).catch(error => {
            reject(error);
        });
    });

}

export default setupComponentArray;
