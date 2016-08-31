'use strict';

//required dependicies
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var inject  = require("gulp-inject");
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var clean = require('del');
var args = require('yargs').argv;

//configuration destination paths
const destRoot= 'dist';
const destJSRoot = 'dist/js';
const destCSSRoot = 'dist/css';
//filenames
const destIndexFileName = 'index.html';
const destMainJSFileName = "main.js";
const destJSSuffixDev = "-debug.js"
const destJSSuffixMin = "-min.js";

//configuration source paths
const srcRoot = 'src';
const srcJSRoot = 'src/app/**';
const srcSassRoot = 'src/styles/**';
const srcIndexTplFile = 'src/index.tpl.html';
const srcJSFile = 'src/app/app.js';



//Clean the destination folder
gulp.task('clean', function(){
    return clean([
        destRoot
    ]);
});

//Make a http server for development
gulp.task('connect', function () {
	connect.server({
		root: destRoot,
		port: 4000
	});
})

//Bundle javascript files, minify the files and save them to the destination folder
gulp.task('browserify', function() {
	// Grabs the app.js file
    return browserify(srcJSFile)
        .bundle()
        .pipe(source(destMainJSFileName))
				.pipe(buffer())
				.pipe(minify({
					ext:{
            src: destJSSuffixDev,
            min: destJSSuffixMin
        	},
					noSource: args.dev !== true
				}))
        // saves it the public/js/ directory
        .pipe(gulp.dest( destJSRoot ));
})

//grap the index template rename and copy the file to the destination folder (wait for browserify and sass to complete)
gulp.task('index', ['browserify', 'sass'], function(){
		// It's not necessary to read the files (will speed up things), we're only after their paths:
		var sources = gulp.src([ args.dev === true ? destJSRoot + '/*-debug.js' : destJSRoot + '/*-min.js', destCSSRoot + '/*.css'], {read: false});

    return gulp.src(srcIndexTplFile)
        .pipe(rename(destIndexFileName))
				.pipe(inject(sources, { ignorePath: destRoot }))
        .pipe(gulp.dest(destRoot));
})

//grab the sass file and convert to css copy the file to the css folder
gulp.task('sass', function() {
	/*return sass(srcSassRoot + '/*.scss')
		.pipe(gulp.dest(destCSSRoot));*/
	return gulp.src(srcSassRoot + '/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(destCSSRoot));
})

//Check if files are changed and start task if nessecary
gulp.task('watch', function() {
	gulp.watch( srcJSRoot + '/*.js', ['browserify'])
	gulp.watch( srcSassRoot + '/*.scss', ['sass'])
	gulp.watch( srcIndexTplFile, ['index'] )
})

//Main gulp commands
//build the project
gulp.task('build', ['browserify', 'index',  'sass'])
//clean up destination folder and build the project
gulp.task('build-clean', ['clean', 'index', 'browserify', 'sass'])
//build the project and startup http server
gulp.task('default', [ 'browserify', 'index', 'sass', 'connect', 'watch'])
