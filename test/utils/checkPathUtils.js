import test   from 'ava';
import {
    getParamCasePath,
    getCorrectPathForFile
} from '../../lib/utils';

test('Params Path', t => {
    const originalPath = '/Users/foo/code/test/components/componentFile.vue';
    const correctPath  = '/Users/foo/code/test/components/component-file.vue';

    t.is(getParamCasePath(originalPath), correctPath);
});

test('finds test Path ', t => {
    const testPath = __dirname + '/../component.vue';
    return getCorrectPathForFile(testPath, 'test')
    .then(paramPath => {
        t.pass(typeof paramPath, 'string');
    }).catch(err => {
        t.fail(err);
    });

});

test('shows error for fake test Path ', t => {
    const testPath = __dirname + '/../componentDoesntExist.vue';
    const errMessage = `Could not find test file at ${__dirname}/../componentDoesntExist.vue`

    return getCorrectPathForFile(testPath, 'test')
    .catch(error => {
        t.is(error.message, errMessage);
    })
});
