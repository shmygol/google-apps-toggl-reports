'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');
var minimist = require('minimist');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var del = require('del');

/*
 * Variables
 */

var srcFolders = {
  _all: ['server', 'libs'],
  dev: []
};

// minimist structure and defaults for this task configuration
var knownOptions = {
  string: ['env'],
  'default': {
    env: 'dev'
  }
};
var options = minimist(process.argv.slice(2), knownOptions);

// The root staging folder for gapps configurations
var dstRoot = 'build/' + options.env + '/src',
    dstConcatFile = 'build/' + options.env,
    concatFileName = 'src.js';
/*
 * TASKS
 */

// Runs the copy-latest task, then calls gapps upload in the correct
// configuration directory based on the target environment
gulp.task('upload-latest', ['copy-latest'], shell.task(['gapps upload'],
    {cwd: 'build/' + options.env}));


// Runs the copy-latest task, then concate all the code to one file
gulp.task('copy-latest-to-file', ['copy-latest'], function() {
  return gulp.src(dstRoot + '/*.js')
    .pipe(concat(concatFileName))
    .pipe(gulp.dest(dstConcatFile));
});

// Copies all files based on the current target environment.
// Completion of "clean-deployment" is a prerequisite for starting the copy
// process.
gulp.task('copy-latest', ['lint', 'test'], function() {
  // TODO: Implement as a synchronous dependency when this feature will be released with Gulp4
  gulp.run('clean-deployment');

  var streams = merge();

  streams.add(
    gulp.src('environments/' + options.env + '/*.js')
      .pipe(rename({prefix: 'environments.'}))
      .pipe(gulp.dest(dstRoot)));

  srcFolders._all.forEach(function(dir, index, array) {
    streams.add(
      gulp.src([dir + '/*.js'])
        .pipe(rename({prefix: dir + '.'}))
        .pipe(gulp.dest(dstRoot)));
  });

  return streams;
});

// Check code style of the js files in all source folders
gulp.task('lint', function() {
  var jsMasks = [];
  srcFolders._all.forEach(function(dir, index, array) {
    jsMasks.push(dir + '/*.js');
  });
  return gulp.src(jsMasks)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

// Mocha test
gulp.task('test', ['lint'], function() {
  return gulp.src('tests/**/*.js', {read: false})
      .pipe(mocha({ui: 'tdd'}));
});

/*
 * Utility tasks
 */

gulp.task('clean-deployment', function(cb) {
  return del([
    dstConcatFile + '/' + concatFileName,
    dstRoot + '/*.*'
  ]);
});

gulp.task('clean-deployments', function(cb) {
  return del([
    'build/dev/src/*.*',
    'build/dev/' + concatFileName,
    'build/tst/src/*.*' ,
    'build/tst/' + concatFileName,
    'build/prd/src/*.*',
    'build/prd/' + concatFileName
  ]);
});

