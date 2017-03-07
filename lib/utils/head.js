// @flow
const metaWarning = 'Deprecation Warning: Please update your meta object. Check github project for more information. \nhttps://github.com/danmademe/express-vue';
//Checks Vue Object to check if a meta object is inside head
//Returns Boolean
function checkMetaInsideHead(vueObject: Object): boolean {
    let isMetaInsideHead: boolean = false;
    if (vueObject.meta && vueObject.meta.head) {
        isMetaInsideHead = false;
    } else if(vueObject.head && vueObject.head.meta) {
        isMetaInsideHead = true;
    }
    return isMetaInsideHead;
}

//Support for legacy v3.7.2 and lower
// vue: {
//     meta: {
//         title: 'Page Title',
//         head: [
//             { property:'og:title', content: 'Page Title'},
//             { name:'twitter:title', content: 'Page Title'},
//         ]
//     }
// }
function legacyMetaTags(metaTags: string, vueObject: Object): string {
    console.warn(metaWarning);
    if (vueObject.meta && vueObject.meta.head) {
        for (let metaItem of vueObject.meta.head) {
            if (metaItem.name) {
                metaTags += `<meta name=\"${metaItem.name}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.property) {
                metaTags += `<meta property=\"${metaItem.property}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.script) {
                const charset = metaItem.charset || 'utf-8';
                metaTags += `<script src=\"${metaItem.script}\" charset=\"${charset}\"></script>`;
            } else if (metaItem.style) {
                const type = metaItem.type || 'text/css';
                const rel  = metaItem.rel || 'stylesheet';
                metaTags += `<link rel=\"${rel}\" type=\"${type}\" href=\"${metaItem.style}\">`;
            }
        }
    }
    return metaTags;
}

//For v3.7.3 and greater
// vue: {
//     head: {
//         title: 'Page Title',
//         meta: [
//             { property:'og:title', content: 'Page Title'},
//             { name:'twitter:title', content: 'Page Title'},
//         ]
//     }
// }
function createMetaTags(metaTags: string, vueObject: Object): string {
    if (vueObject.head && vueObject.head.meta) {
        for (let metaItem of vueObject.head.meta) {
            if (metaItem.name) {
                metaTags += `<meta name=\"${metaItem.name}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.property) {
                metaTags += `<meta property=\"${metaItem.property}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.script) {
                const charset = metaItem.charset || 'utf-8';
                metaTags += `<script src=\"${metaItem.script}\" charset=\"${charset}\"></script>`;
            } else if (metaItem.style) {
                const type = metaItem.type || 'text/css';
                const rel  = metaItem.rel || 'stylesheet';
                metaTags += `<link rel=\"${rel}\" type=\"${type}\" href=\"${metaItem.style}\">`;
            }
        }
    }
    return metaTags;
}

function headUtil(vueObject: Object) {
    let metaTags       = '';
    let title          = '';
    let structuredData = '';
    if (vueObject) {
        const hasNewHeadBlock = checkMetaInsideHead(vueObject);

        if (vueObject.head && hasNewHeadBlock) {
            metaTags = createMetaTags(metaTags, vueObject);
        } else if (vueObject.meta && !hasNewHeadBlock) {
            metaTags = legacyMetaTags(metaTags, vueObject);
        }

        if (vueObject.meta && vueObject.meta.title) {
            console.warn(metaWarning);
            title = `<title>${vueObject.meta.title}</title>`;
        } else if (vueObject.head && vueObject.head.title) {
            title = `<title>${vueObject.head.title}</title>`;
        }

        if (vueObject.head && vueObject.head.structuredData) {
            structuredData = `<script type="application/ld+json">${JSON.stringify(vueObject.head.structuredData)}</script>`;
        }
    }

    return title + metaTags + structuredData + '</head>';
}

export default headUtil;
