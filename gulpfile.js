var gulp = require('gulp');
var run = require('gulp-run');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var runSeq = require('run-sequence');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream')

// Live reload
gulp.task('reload', function() {
    livereload.reload();
})

// Default
gulp.task('default', function() {
    livereload.listen();
    gulp.start('build');

    gulp.watch(['client/pre-build/app.js', 'client/pre-build/**/*.js'], function() {
        runSeq('buildJS', 'reload');
    });

    // gulp.watch(['client/game/index.js','client/game/**/*.js'],function(){
    //     runSeq('browserify','reload');
    // })

    gulp.watch(['client/pre-build/app.scss', 'client/pre-build/**/*.scss', 'client/pre-build/**/**/**/*.scss'], function() {
        runSeq('buildCSS', 'reload');
    });

    // Reload when a template (.html) file changes.
    gulp.watch(['client/**/*.html', 'server/*.html'], ['reload']);

    // gulp.watch(['tests/**/*.js'], ['testServerJS']);

});


// Database seed
gulp.task('seedDB', function() {
    run('node seed.js').exec();
});



// Build tasks
// Build all for normal use
gulp.task('build', function() {
    runSeq(['buildJS', 'buildCSS']);
});

// //for testing
// gulp.task('build', function() {
//     runSeq(['buildJS', 'buildCSS', 'testServerJS']);
// });


//Browserify
gulp.task('browserify', function() {
    return browserify('./client/game/index.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./client/build'))
});


gulp.task('buildJS', function() {
    return gulp.src(['./client/pre-build/app.js', './client/pre-build/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('build.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./client/build'));
});

gulp.task('buildCSS', function() {
    return gulp.src('./client/pre-build/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(rename('build.css'))
        .pipe(gulp.dest('./client/build'));
});


// Testing
// gulp.task('testServerJS', function() {
//     return gulp.src(['./server/db/models/', './tests/**/*.spec.js'], {
//             read: false
//         })
//         .pipe(mocha({
//             reporter: 'spec'
//         }));
// });