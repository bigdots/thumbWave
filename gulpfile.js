const { src, dest } = require('gulp')
var clean = require('gulp-clean')
var uglify = require('gulp-uglify')
const babel = require('gulp-babel')

exports.default = function () {
  return src('src/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(clean())
    .pipe(dest('dist/'))
}
