import gulp from 'gulp'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import gutil from 'gulp-util'
import babelify from 'babelify'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import cssmin from "gulp-cssmin";
import postcss from 'gulp-postcss'
import cssnext from 'postcss-cssnext'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import connect from 'electron-connect'

const electron = connect.server.create();

const dependencies = [
  'react',
    'react-dom'
];
let scriptsCount = 0;

const paths = {
    'css': 'build/css/',
    'scss': 'src/scss/',
    'jsx': 'src/jsx/',
    'js': 'build/js/'
}

gulp.task('scss', () =>
          bundleScss())

gulp.task('compile', () =>
        bundleApp(false))

gulp.task('deploy', () =>
        bundleApp(true))

gulp.task('electron', () =>
        electron.start())

gulp.task('watch',  () => {
  gulp.watch([paths.scss + '**/*.scss'], ['scss']);
  gulp.watch([paths.jsx + '**/*.js'], ['compile']);
  gulp.watch(['./index.html'], ['compile']);
  gulp.watch(['build/js/*.js'], electron.restart);
  gulp.watch(['index.html', '**/*.{html,js,css}'], electron.reload);
});

gulp.task('default', ['electron', 'compile', 'watch', 'scss']);

const bundleScss = () => {
    let processors = [
      cssnext()
    ];
    let task = gulp.src(paths.scss + '**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: require('node-reset-scss').includePath
        }))
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe(postcss(processors))
        .pipe(sourcemaps.write());
    
    return task
            .pipe(cssmin())
            .pipe(gulp.dest(paths.css));
}

const bundleApp = (isProduction) => {
  scriptsCount++;
  var appBundler = browserify({
      entries: paths.jsx + 'main.js',
      debug: true
    });

    if (scriptsCount === 1){
        let task = 
          browserify({
          require: dependencies,
          debug: true
        })
      .bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'));
        if (!isProduction)
            task.pipe(gulp.dest(paths.js));
        else
            task
            .pipe(buffer())
            .pipe(uglify({preserveComments: 'some'}))
      .pipe(gulp.dest(paths.js));
    }

    if (!isProduction){
      dependencies.forEach(function(dep){
        appBundler.external(dep);
      })
    }

    if (!isProduction){
        appBundler
          .transform("babelify", {presets: ["es2015", "react"]})
          .bundle()
          .on('error',gutil.log)
          .pipe(source('bundle.js'))
          .pipe(gulp.dest(paths.js));
    } else {
        process.env.NODE_ENV = 'production';
        appBundler
          .transform("babelify", {presets: ["es2015", "react"]})
          .bundle()
          .on('error',gutil.log)
          .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(uglify({preserveComments: 'some'}))
          .pipe(gulp.dest(paths.js));
        bundleScss();
    }
}