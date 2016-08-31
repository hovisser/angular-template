//required dependicies
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var inject  = require("gulp-inject");
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var clean = require('del');
var args = require('yargs').argv;


//Clean the destination folder
gulp.task('clean', function(){
    return clean([
        './dist'
    ]);
});

//Make a http server for development
gulp.task('connect', function () {
	connect.server({
		root: 'dist',
		port: 4000
	})
})

//Bundle javascript files, minify the files and save them to the destination folder
gulp.task('browserify', function() {
	// Grabs the app.js file
    return browserify('./app/app.js')
        .bundle()
        .pipe(source('main.js'))
				.pipe(buffer())
				.pipe(minify({
					ext:{
            src:'-debug.js',
            min:'-min.js'
        	},
        	ignoreFiles: ['.combo.js', '-min.js'],
					noSource: args.dev !== true
				}))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./dist/js/'));
})

//grap the index template rename and copy the file to the destination folder (wait for browserify and sass to complete)
gulp.task('index', ['browserify', 'sass'], function(){
		// It's not necessary to read the files (will speed up things), we're only after their paths:
		var sources = gulp.src([ args.dev === true ? './dist/js/*-debug.js' : './dist/js/*-min.js', './dist/css/*.css'], {read: false});

    return gulp.src('./app/index.tpl.html')
        .pipe(rename('index.html'))
				.pipe(inject(sources, { ignorePath: 'dist' }))
        .pipe(gulp.dest('./dist/'))
})

//grab the sass file and convert to css copy the file to the css folder
gulp.task('sass', function() {
	return sass('./app/style/style.sass')
		.pipe(gulp.dest('./dist/css/'))
})

//Check if files are changed and start task if nessecary
gulp.task('watch', function() {
	gulp.watch('app/**/*.js', ['browserify'])
	gulp.watch('app/style/style.sass', ['sass'])
	gulp.watch('app/index.tpl.html', ['index'] )
})

//Main gulp commands
//build the project
gulp.task('build', ['browserify', 'index',  'sass', 'watch'])
//clean up destination folder and build the project
gulp.task('build-clean', ['clean', 'index', 'browserify', 'sass', 'watch'])
//build the project and startup http server
gulp.task('default', [ 'browserify', 'index', 'sass', 'connect', 'watch'])
