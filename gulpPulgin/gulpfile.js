var gulp = require('gulp'),
    gutil = require('gulp-util');

var chenllos = require('./plugin_learn');


gulp.task('test', function(){
    gulp.src('./test/test.js')
        .pipe( chenllos )
        .pipe( gulp.dest('./dest') );
});


gulp.task('default', ['test'], function(){
    console.log( 'running default' );
} );