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
const destRoot= 'dist';
const destJSRoot = 'dist/js';
const destCSSRoot = 'dist/css';
//filenames
const destIndexFileName = 'index.html';
const destMainJSFileName = "main.js";
//suffixes
const destJSSuffixDev = "-debug.js"
const destJSSuffixMin = "-min.js";
//destination wildcards
const destCSSRootWildCard = destCSSRoot + '/*.css';
const destJSRootWildCard = destJSRoot + '/*.js';

//configuration source paths
const srcRoot = 'src';
const srcJSRoot = 'src/app/**';
const srcTemplateRoot = 'src/app/components/**/*.view.html';
const srcSassRoot = 'src/assets/css/**';
const srcIndexTplFile = 'src/index.tpl.html';
const srcJSModuleFile = 'src/app/app.module.js';
//source wildecards
const srcSassRootWildCard = srcSassRoot + '/*.scss';
const srcJSRootWildCard = srcJSRoot + '/*.js';

const devHttpPort=9090;

/**
*  Begin region gulp tasks
**/
//Clean the destination folder
gulp.task('clean', function(){
    return clean([
        destRoot
    ]);
});

//Clean the javascript destination folder
gulp.task('cleanjs', function(){
    return clean([
       destJSRoot
    ]);
});


//Make a http server for development
gulp.task('connect', function () {
	connect.server({
		root: destRoot,
		port: devHttpPort
	});
});

//Bundle javascript files, minify the files and save them to the destination folder
gulp.task('browserify', ['cleanjs'], function() {
	// Grabs the app.js file
    var gen = browserify(srcJSModuleFile)
        .bundle()
        .pipe(source(destMainJSFileName))
				.pipe(buffer());

      //if not development minify files
      if(args.dev !== true){
  				return gen.pipe(minify({
  					ext:{
              //src: destJSSuffixDev,
              min: destJSSuffixMin
          	},
  					noSource: true
  				}))
          .pipe(gulp.dest( destJSRoot ));
      } else {
          return gen.pipe(gulp.dest( destJSRoot ));
      }
});

//Load the templates and put them in the template Cache
gulp.task('templates', ['browserify'], function(){
    return gulp.src( srcTemplateRoot )
        .pipe(templateCache( { module: 'app' }))
        .pipe(gulp.dest( destJSRoot ));
});

//grap the index template rename and copy the file to the destination folder (wait for browserify and sass to complete)
gulp.task('index', ['browserify', 'templates', 'sass'], function(){
		// It's not necessary to read the files (will speed up things), we're only after their paths:
		var sources = gulp.src([destJSRootWildCard, destCSSRootWildCard], {read: false});

    return gulp.src(srcIndexTplFile)
        .pipe(rename(destIndexFileName))
				.pipe(inject(sources, { ignorePath: destRoot }))
        .pipe(gulp.dest(destRoot));
});

//grab the sass file and convert to css copy the file to the css folder
gulp.task('sass', function() {
	return gulp.src(srcSassRootWildCard)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(destCSSRoot));
});

//Check if files are changed and start task if nessecary
gulp.task('watch', function() {
	gulp.watch( srcJSRootWildCard, ['browserify', 'templates']);
	gulp.watch( srcSassRootWildCard, ['sass']);
	gulp.watch( srcIndexTplFile, ['index'] );
  gulp.watch( srcTemplateRoot, ['templates']);
});

//Main gulp commands
//build the project
gulp.task('build', ['browserify', 'index',  'sass', 'templates']);
//build the project and startup http server
gulp.task('default', [ 'build', 'connect', 'watch']);
/**
*	End regin gulp tasks
*/
