"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');


const dist = "./dist/";
// const dist = "C:/MAMP/htdocs/project";

gulp.task("copy-html", () => {
    return gulp.src("./src/index.html")
                .pipe(htmlmin({ collapseWhitespace: true }))
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("copy-fonts", () => {
  return gulp.src("./src/fonts/**/*.*")
              .pipe(gulp.dest(dist + "/assets/fonts"))
              .on("end", browsersync.reload);
});

gulp.task("copy-icons", () => {
  return gulp.src("./src/icons/**/*.*")
              .pipe(gulp.dest(dist + "/assets/icons"))
              .on("end", browsersync.reload);
});

gulp.task("copy-img", () => {
  return gulp.src("./src/img/**/*.*")
              .pipe(imagemin())
              .pipe(gulp.dest(dist + "/assets/img"))
              .on("end", browsersync.reload);
});

gulp.task("copy-css", () => {
  return gulp.src("./src/sass/**/*.+(scss|sass)")
              .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
              .pipe(rename({ suffix: '.min', prefix: '' }))
              .pipe(autoprefixer())
              .pipe(cleanCSS({ compatibility: 'ie8' }))
              .pipe(gulp.dest(dist + "/assets/css"))
              .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./src/sass/**/*.+(scss|sass|css)", gulp.parallel("copy-css"));
    gulp.watch("./src/fonts/**/*.*", gulp.parallel("copy-fonts"));
    gulp.watch("./src/icons/**/*.*", gulp.parallel("copy-icons"));
    gulp.watch("./src/img/**/*.*", gulp.parallel("copy-img"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-css", "copy-fonts", "copy-icons", "copy-img", "build-js"));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));