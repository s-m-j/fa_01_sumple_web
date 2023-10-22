// Инициализация
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// Для синтаксисв @use используем dart-sass
// sass.compiler = require("dart-sass");

// Sass Task
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist", { sourcemap: "." }));
}

// JavaScript Task
function jsTask() {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(babel({ presets: [] }))
    .pipe(terser())
    .pipe(dest("dist", { sourcemap: "." }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: 0,
      },
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Говорим Gulp отслеживать изменения в таких файлах
function watchTask() {
  watch("**.html", browserSyncReload);
  watch(
    ["app/scss/**/*.scss", "app/**/*.js"],
    series(scssTask, jsTask, browserSyncReload)
  );
}

// DefaultGulpTask
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);
