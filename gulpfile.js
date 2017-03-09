var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var nsp = require('gulp-nsp');
var babel = require('gulp-babel');
var del = require('del');
var ava = require('gulp-ava');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-register');

gulp.task('eslint', function () {
    return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
    nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('typescript', ['clean'], function() {
    return gulp.src('lib/**/*.ts')
    .pipe(gulp.dest('dist'));
});

gulp.task('babel', ['typescript'], function () {
    return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return del('dist');
});

gulp.task('test', ['eslint'], function() {
    return gulp.src('test/**/*.js')
        .pipe(ava({nyc:true}));
});

gulp.task('build', ['nsp', 'babel']);

gulp.task('watch', function () {
    gulp.watch(['lib/**/*.js'], ['build']);
});
