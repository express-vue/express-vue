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
    const paramPath = getCorrectPathForFile(testPath, 'test');
    t.pass(typeof paramPath, 'string');
});

test('shows error for fake test Path ', t => {
    const testPath = __dirname + '/../componentDoesntExist.vue';
    const errMessage = `Could not find test file at ${__dirname}/../componentDoesntExist.vue`
    const err = new Error(errMessage);

    // const paramPath = getCorrectPathForFile(testPath, 'test');
    const error = t.throws(() => {
        getCorrectPathForFile(testPath, 'test');
    }, Error);

    t.is(error.message, errMessage);
});
