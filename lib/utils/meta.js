function metaUtil(metaObject) {
    let metaTags = '';
    let title    = '';

    if (metaObject.head) {
        for (let metaItem of metaObject.head) {
            if (metaItem.name) {
                metaTags += `<meta name=\"${metaItem.name}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.property) {
                metaTags += `<meta property=\"${metaItem.property}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.script) {
                const charset = metaItem.charset || 'utf-8'
                metaTags += `<script src=\"${metaItem.script}\" charset=\"${charset}\"></script>`
            } else if (metaItem.style) {
                const type = metaItem.type || 'text/css';
                const rel  = metaItem.rel || 'stylesheet';
                metaTags += `<link rel=\"${rel}\" type=\"${type}\" href=\"${metaItem.style}\">`
            }
        }
    }

    if (metaObject.title) {
        title = `<title>${metaObject.title}</title>`;
    }

    return title + metaTags + '</head>';
}

export default metaUtil;
