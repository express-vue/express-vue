const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const nsp = require('gulp-nsp');
const babel = require('gulp-babel');
const del = require('del');
const ava = require('gulp-ava');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');

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

gulp.task('watch', ['babel'], function () {
    livereload.listen({
        port: 35730
    });
    nodemon({
        script: 'example/',
        stdout: true,
        watch : ['lib', 'example'],
        ext   : 'js scss vue',
        tasks : ['clean', 'typescript', 'babel'],
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if (/^listening/.test(chunk)) {
                livereload.reload();
            }
            process.stdout.write(chunk);
        });
    });
});


gulp.task('clean', function () {
    return del('dist');
});

gulp.task('test', ['eslint'], function() {
    return gulp.src('test/**/*.js')
        .pipe(ava({nyc:true}));
});

gulp.task('build', ['nsp', 'babel']);

gulp.task('default', ['watch']);
