'use strict';

/**
* Begin region required dependicies
**/
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var inject  = require("gulp-inject");
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var size = require('gulp-size');
var templateCache = require('gulp-angular-templatecache');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var clean = require('del');
var args = require('yargs').argv;

/**
*  Begin region configuration
*
* @TODO:
* place to separated file hvisser 31-08-2016
* Suggestion: place in separated file
* For now this is ok.
*
**/
//configuration destination paths
const DEST_ROOT= 'dist';
const DEST_JS_ROOT = 'dist/js';
const DEST_CSS_ROOT = 'dist/css';
//filenames
const DEST_INDEX_FILENAME = 'index.html';
const DEST_MAIN_JS_FILENAME = "main.js";
//suffixes
const DEST_JS_SUFFIX_DEV = "-debug.js"
const DEST_JS_SUFFIX_MIN = "-min.js";
//destination wildcards
const DEST_CSS_ROOT_WILDCARD = DEST_CSS_ROOT + '/*.css';
const DEST_JS_ROOT_WILDCARD = DEST_JS_ROOT + '/*.js';

//configuration source paths
const SRC_ROOT = 'src';
const SRC_JS_ROOT = 'src/app/**';
const SRC_TPL_ROOT = 'src/app/components/**/*.view.html';
const SRC_SASS_ROOT = 'src/assets/css/**';
const SRC_INDEX_TPL_FILE = 'src/index.tpl.html';
const SRC_JS_MODULE_FILE = 'src/app/app.module.js';
//source wildecards
const SRC_SASS_ROOT_WILDCARD = SRC_SASS_ROOT + '/*.scss';
const SRC_JS_ROOT_WILDCARD = SRC_JS_ROOT + '/*.js';
//dev server http port
const DEV_HTTP_PORT=9090;

const SIZE_OPTS = {
    showFiles: true,
    gzip: true
};

/**
*  Begin region gulp tasks
**/
//Clean the destination folder
gulp.task('clean', function(){
    return clean([
        DEST_ROOT
    ]);
});

//Clean the javascript destination folder
gulp.task('cleanjs', function(){
    return clean([
       DEST_JS_ROOT
    ]);
});


//Make a http server for development
gulp.task('connect', function () {
	connect.server({
		root: DEST_ROOT,
		port: DEV_HTTP_PORT
	});
});

//Bundle javascript files, minify the files and save them to the destination folder
gulp.task('browserify', ['cleanjs'], function() {
	// Grabs the app.js file
    var gen = browserify(SRC_JS_MODULE_FILE)
        .bundle()
        .pipe(source(DEST_MAIN_JS_FILENAME))
				.pipe(buffer())
        .pipe(size(SIZE_OPTS)); //size before

      //if not development minify files
      if(args.dev !== true){
  				return gen.pipe(minify({
  					ext:{
              //src: DEST_JS_SUFFIX_DEV,
              min: DEST_JS_SUFFIX_MIN
          	},
  					noSource: true
  				}))
          .pipe(size(SIZE_OPTS)) //size after
          .pipe(gulp.dest( DEST_JS_ROOT ));
      } else {
          return gen.pipe(size(SIZE_OPTS)) //size after
            .pipe(gulp.dest( DEST_JS_ROOT ));
      }
});

//Load the templates and put them in the template Cache
gulp.task('templates', ['browserify'], function(){
    return gulp.src( SRC_TPL_ROOT )
        .pipe(templateCache( { module: 'app' }))
        .pipe(gulp.dest( DEST_JS_ROOT ));
});

//grap the index template rename and copy the file to the destination folder (wait for browserify and sass to complete)
gulp.task('index', ['browserify', 'templates', 'sass'], function(){
		// It's not necessary to read the files (will speed up things), we're only after their paths:
		var sources = gulp.src([DEST_JS_ROOT_WILDCARD, DEST_CSS_ROOT_WILDCARD], {read: false});

    return gulp.src(SRC_INDEX_TPL_FILE)
        .pipe(rename(DEST_INDEX_FILENAME))
				.pipe(inject(sources, { ignorePath: DEST_ROOT }))
        .pipe(gulp.dest(DEST_ROOT));
});

//grab the sass file and convert to css copy the file to the css folder
gulp.task('sass', function() {
	return gulp.src(SRC_SASS_ROOT_WILDCARD)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DEST_CSS_ROOT));
});

//Check if files are changed and start task if nessecary
gulp.task('watch', function() {
	gulp.watch( SRC_JS_ROOT_WILDCARD, ['browserify', 'templates']);
	gulp.watch( SRC_SASS_ROOT_WILDCARD, ['sass']);
	gulp.watch( SRC_INDEX_TPL_FILE, ['index'] );
  gulp.watch( SRC_TPL_ROOT, ['templates']);
});

//Main gulp commands
//build the project
gulp.task('build', ['browserify', 'index',  'sass', 'templates']);
//build the project and startup http server
gulp.task('default', [ 'build', 'connect', 'watch']);
/**
*	End regin gulp tasks
*/
