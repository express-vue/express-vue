// @flow

function renderError(error: string, callback: Function) {
    console.error(error);
    callback(new Error(error));
}

export default renderError;
