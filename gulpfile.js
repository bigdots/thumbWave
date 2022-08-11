const gulp = require('gulp')
const { src, dest, parallel, series } = gulp
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

// clean
function cleanDist() {
  return src('dist/', { read: false, allowEmpty: true }).pipe(clean())
}

// js
function bulidjs() {
  return src('src/*.js').pipe(babel()).pipe(uglify()).pipe(dest('dist/'))
}

// json wxss wxml
function bulidjson(cb) {
  return src(['src/*.json', 'src/*.wxml', 'src/*.wxss']).pipe(dest('dist/'))
}

exports.default = series(cleanDist, parallel(bulidjs, bulidjson))
