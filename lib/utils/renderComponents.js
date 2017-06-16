// @flow
import renderError from './renderError';
import {renderHtmlUtil} from './render';
import Defaults from '../models';

function renderComponents(components: Object, defaults: Defaults, callback: Function) {
    renderHtmlUtil(components, defaults).then(function(html) {
        callback(null, html);
    })
        .catch(function(error) {
            renderError(error, callback);
        });
}

export default renderComponents;
