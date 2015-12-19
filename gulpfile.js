var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    KarmaServer = require('karma').Server;

var files = {
  src: [ './src/module.js', './src/**/*.js' ],
  dist: './dist/'
};

gulp.task('default', [ 'test', 'build' ]);

gulp.task('build', [ 'test' ], function (done) {
  return gulp.src(files.src)
    .pipe(concat('PromiseWaterfall.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(files.dist))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(files.dist));
});

gulp.task('test', function (done) {
  return new KarmaServer({
    configFile: __dirname + '/config/karma.conf.js',
    singleRun: true
  }, done).start();
});
