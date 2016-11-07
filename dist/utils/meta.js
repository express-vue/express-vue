'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function metaUtil(metaObject) {
    var metaTags = '';
    var title = '';

    if (metaObject.head) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = metaObject.head[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var metaItem = _step.value;

                if (metaItem.name) {
                    metaTags += '<meta name="' + metaItem.name + '" content="' + metaItem.content + '" />';
                } else if (metaItem.property) {
                    metaTags += '<meta property="' + metaItem.property + '" content="' + metaItem.content + '" />';
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    if (metaObject.title) {
        title = '<title>' + metaObject.title + '</title>';
    }

    return title + metaTags + '</head>';
}

exports.default = metaUtil;
module.exports = exports['default'];