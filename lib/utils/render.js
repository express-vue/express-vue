import {Types}          from '../defaults';
import {scriptToString} from './string';
import headUtil         from './head';
import paramCase        from 'param-case';

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
            let head = '';
            html = layout.template.replace(appRegex, `<div id="app">${renderedHtml}</div>`);
            html = html.replace(scriptRegex, renderedScriptString);
            head = headUtil(defaults.options.vue);
            html = html.replace(headRegex, head);
            resolve(html);
        });
    });
}

function renderVueComponents(script, components) {
    let componentsString = '';
    for (var component in components) {
        if (components.hasOwnProperty(component)) {
            let currentComponent = components[component];
            if (currentComponent.type === types.SUBCOMPONENT) {
                delete script.components[currentComponent.name];
                componentsString = componentsString + `Vue.component('${paramCase(currentComponent.name)}', ${scriptToString(currentComponent.script)});\n`;
            }
        }
    }
    return componentsString;
}

function renderVueMixins(mixins) {
    let mixinString = '';
    for (var mixin in mixins) {
        if (mixins.hasOwnProperty(mixin)) {
            mixinString = mixinString + `Vue.mixin(${scriptToString(mixins[mixin])});\n`;
        }
    }
    return mixinString;
}

function renderedScript(script, components, mixins) {

    const componentsString = renderVueComponents(script, components);
    if (script.components) {
        delete script.components;
    }
    const mixinString      = mixins !== undefined ? renderVueMixins(mixins) : '';
    const scriptString     = scriptToString(script);
    let debugToolsString   = '';

    if (process.env.VUE_DEV) {
        debugToolsString = 'Vue.config.devtools = true;';
    }
    return `<script>
        (function () {
            'use strict'
            ${mixinString}
            ${componentsString}
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
        ${debugToolsString}
        app.$mount('#app');
    </script>`;
}

function renderHtmlUtil(components, defaults) {
    let mixins = [];
    if (defaults.options.vue && defaults.options.vue.mixins) {
        mixins = defaults.options.vue.mixins;
    }
    let layout = layoutUtil(components);
    let renderedScriptString = renderedScript(layout.script, components, mixins);
    return renderUtil(layout, renderedScriptString, defaults);
}


export {
    renderUtil,
    layoutUtil,
    renderHtmlUtil,
    renderVueComponents,
    renderVueMixins
};
