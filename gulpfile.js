// var gulp = require('gulp');
// var less = require('gulp-less');
// var concat = require('gulp-concat');
// var rename = require('gulp-rename');

// gulp.task('less', function(){
//   return gulp.src('styles/aplication.less')
//     .pipe(less()) // Using gulp-sass
//     .pipe(rename('styles.css'))
//     .pipe(gulp.dest('styles'))
// });

// gulp.task('concat-css-libs', function(){
//   return gulp.src('styles/libs/*')
//     .pipe(concat('libs.css'))
//     .pipe(gulp.dest('styles'))
// });

// gulp.task('watch', function(){
//   gulp.watch('styles/imports/**/*', ['less']);
//   gulp.watch('styles/aplication.less', ['less']);
//   // Other watchers
// })

// gulp.task('default', ['concat-css-libs', 'watch']);

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

// Set up an express server (but not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendfile('index.html', { root: 'dist' });
});

// JSHint task
gulp.task('lint', function() {
  gulp.src('./app/js/*.js')
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  // Bundle to a single file
  .pipe(concat('bundle.js'))
  // Output it to our dist folder
  .pipe(gulp.dest('dist/js'));
});

gulp.task('less', function(){
  return gulp.src('app/styles/aplication.less')
    .pipe(less()) // Using gulp-sass
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('dist/styles'))
});

gulp.task('concat-css-libs', function(){
  return gulp.src('app/styles/libs/*')
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('dist/styles'))
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('app/index.html')
  // And put it in the dist folder
  .pipe(gulp.dest('dist/'));

  // Any other view files from app/views
  gulp.src('./app/views/**/*')
  // Will be put in the dist/views folder
  .pipe(gulp.dest('dist/views/'));
});

gulp.task('watch', ['lint'], function() {
  // Watch our js
  gulp.watch(['app/js/*.js', 'app/js/**/*.js'],[
    'lint',
    'browserify'
  ]);
  gulp.watch('app/styles/imports/**/*', ['less']);
  gulp.watch('app/styles/aplication.less', ['less']);
  gulp.watch(['app/index.html', 'app/views/**/*.html'], [
    'views'
  ]);
});

// Dev task
gulp.task('dev', function() {
  // Start webserver
  server.listen(serverport);
  // Start live reload
  lrserver.listen(livereloadport);
  // Run the watch task, to keep taps on changes
  gulp.run('concat-css-libs');
  gulp.run('watch');
});