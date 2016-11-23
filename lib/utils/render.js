import {Types}          from '../defaults';
import {scriptToString} from './string';
import metaUtil         from './meta';

const renderer    = require('vue-server-renderer').createRenderer();
const appRegex    = /{{{app}}}/igm;
const scriptRegex = /{{{script}}}/igm;
const headRegex   = /<\/head>/igm;
const types       = new Types();

function createApp(script) {
    const Vue = require('vue');
    return new Vue(
        script
    );
}

function layoutUtil(components) {
    let layout = {};
    for (var component of components) {
        switch (component.type) {
        case types.LAYOUT:
            layout = component;
            break;
        case types.COMPONENT:
            layout.script   = component.script;
            break;
        case types.SUBCOMPONENT:
            if (layout.script.components) {
                layout.script.components[component.name] = component.script;
            } else {
                layout.script.components = {};
                layout.script.components[component.name] = component.script;
            }
            break;
        }
    }
    return layout;
}

function renderUtil(layout, renderedScriptString, defaults) {
    return new Promise(function(resolve, reject) {
        renderer.renderToString(createApp(layout.script), function (error, renderedHtml) {
            if (error) {
                reject(error);
            }
            let html = '';
            let meta = '';
            html = layout.template.replace(appRegex, `<div id="app">${renderedHtml}</div>`);
            html = html.replace(scriptRegex, renderedScriptString);
            if (defaults.options.vue && defaults.options.vue.meta) {
                meta = metaUtil(defaults.options.vue.meta);
            } else {
                meta = metaUtil({});
            }

            html = html.replace(headRegex, meta);
            resolve(html);
        });
    });
}

function renderedScript(script) {
    const scriptString = scriptToString(script);
    return `<script>
        (function () {
            'use strict'
            var createApp = function () {
                return new Vue(
                    ${scriptString}
                )
            }
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = createApp
            } else {
                this.app = createApp()
            }
        }).call(this)
    </script>`;
}

function renderHtmlUtil(components, defaults) {
    let layout = layoutUtil(components);
    let renderedScriptString = renderedScript(layout.script);
    return renderUtil(layout, renderedScriptString, defaults);
}


export {
    renderUtil,
    layoutUtil,
    renderHtmlUtil
};
