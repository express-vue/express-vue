function scriptToString(script) {
    let string = '';
    for (let member in script) {
        switch (typeof script[member]) {
        case 'function':
            string += member + ': ' + String(script[member]) + ',';
            break;
        case 'string':
            string += member + ': ' + JSON.stringify(script[member]) + ',';
            break;
        case 'object':
            if (member === 'data') {
                string += member + ': ' + JSON.stringify(script[member]) + ',';
            } else {
                string += member + ': ' + scriptToString(script[member]) + ',';
            }
            break;

        }
    }
    return `{${string}}`;
}

export {scriptToString};
