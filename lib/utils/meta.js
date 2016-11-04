function metaUtil(metaObject) {
    let metaTags = '';
    let title    = '';

    if (metaObject.head) {
        for (let metaItem of metaObject.head) {
            if (metaItem.name) {
                metaTags += `<meta name=\"${metaItem.name}\" content=\"${metaItem.content}\" />`;
            } else if (metaItem.property) {
                metaTags += `<meta property=\"${metaItem.property}\" content=\"${metaItem.content}\" />`;
            }
        }
    }

    if (metaObject.title) {
        title = `<title>${metaObject.title}</title>`;
    }

    return title + metaTags + '</head>';
}

export default metaUtil;
