'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  watchify = require('watchify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  fs = require('fs'),
  sourcemaps = require('gulp-sourcemaps'),
  _ = require('lodash'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  // env = require('gulp-env'),
  bundler

// const envs = env.set({
//   NODE_ENV: 'production'
// })

function getBundler() {

  if (!bundler) {
    bundler = watchify(

      browserify('./assets/js/app.js', _.extend({
        debug: true
      }, watchify.args))
      .transform(babelify, {
        presets: ["es2015", "stage-2"]
      })

    )
  }
  return bundler;

};

function bundle() {

  return getBundler()
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err.message);
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js/'))
    .pipe(reload({
      stream: true
    }));

}

gulp.task('build-persistent', function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {

  gulp
    .src('./assets/js/main.js')
    // .pipe(envs)
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('styles', function() {

  gulp.src('./assets/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(reload({
      stream: true
    }));

});

gulp.task('watch', ['build-persistent'], function() {

  browserSync.init({
    proxy: 'felipearosemena.v2.dev'
  })

  gulp.watch('./assets/scss/**/*.scss', ['styles']);

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});

// WEB SERVER
gulp.task('serve', function() {

  browserSync({
    server: {
      baseDir: './'
    }
  });

});