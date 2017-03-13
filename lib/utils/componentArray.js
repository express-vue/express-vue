// @flow
import {Defaults, Types} from '../models';
import {
    layoutParser,
    componentParser
} from '../parser';

let types = new Types();

function setupComponentArray(componentPath: string, defaults: Defaults) {
    let array = [];
    array.push(layoutParser(defaults.layoutPath, defaults, types.LAYOUT));
    array.push(componentParser(componentPath, defaults, types.COMPONENT));

    if (defaults.options.vue && defaults.options.vue.components) {
        for (var component in defaults.options.vue.components) {
            if (defaults.options.vue.components.hasOwnProperty(component)) {
                const componentFile = defaults.componentsDir + defaults.options.vue.components[component] + '.vue';
                array.push(componentParser(componentFile, defaults, types.SUBCOMPONENT));
            }
        }
    }
    return array;
}

export default setupComponentArray;
