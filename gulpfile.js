var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('less', function(){
  return gulp.src('styles/aplication.less')
    .pipe(less()) // Using gulp-sass
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('styles'))
});

gulp.task('concat-css-libs', function(){
  return gulp.src('styles/libs/*')
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('styles'))
});

gulp.task('watch', function(){
  gulp.watch('styles/imports/**/*', ['less']);
  gulp.watch('styles/aplication.less', ['less']);
  // Other watchers
})

gulp.task('default', ['concat-css-libs', 'watch']);