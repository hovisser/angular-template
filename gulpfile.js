var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')
// requires browserify and vinyl-source-stream
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer');
var rename = require("gulp-rename");
var minify = require('gulp-minify');


gulp.task('connect', function () {
	connect.server({
		root: 'dist',
		port: 4000
	})
})

gulp.task('browserify', function() {
	// Grabs the app.js file
    return browserify('./app/app.js')
    	// bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
				.pipe(buffer())
				.pipe(minify({
					ext:{
            src:'-debug.js',
            min:'.js'
        	},
        	ignoreFiles: ['.combo.js', '-min.js']
				}))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./dist/js/'));
})

gulp.task('index', function(){
    return gulp.src('./app/index.tpl.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist/'))
})


gulp.task('sass', function() {
	return sass('./app/style/style.sass')
		.pipe(gulp.dest('./dist/css/'))
})


gulp.task('watch', function() {
	gulp.watch('app/**/*.js', ['browserify'])
	gulp.watch('app/style/style.sass', ['sass'])
	gulp.watch('app/index.tpl.html', ['index'] )
})

gulp.task('default', ['index', 'browserify', 'sass','connect', 'watch'])
