var gulp        = require('gulp');
var notify      = require('gulp-notify');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var paths = {
    html:['./build/*.html'],
    css: ['./build/*.css']
};

// ////////////////////////////////////////////////
// HTML 
// ///////////////////////////////////////////////
gulp.task('html', function(){
    gulp.src(paths.html)
        .pipe(reload({stream:true}));
});

// ////////////////////////////////////////////////
// CSS
// ///////////////////////////////////////////////
gulp.task('css', function(){
    gulp.src(paths.css)
        .pipe(reload({stream:true}));
});

// ////////////////////////////////////////////////
// Browser-Sync
// // /////////////////////////////////////////////
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        },
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task('watcher',function(){
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css, ['css']);
});

gulp.task('default', ['watcher', 'browserSync']);