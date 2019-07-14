import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators"

let ts = require("gulp-typescript")
let gulp = require("gulp")
let pug = require("gulp-pug")
let inject = require("gulp-inject")
let concat = require("gulp-concat")
let connect = require("gulp-connect")
let stylus = require("gulp-stylus")
let deploy = require("gulp-gh-pages-will")
let uglify = require("gulp-uglify")
let inline = require('gulp-inline-source')
// let inline = require('gulp-inline')
let source = require("vinyl-source-stream")
let streamify = require("gulp-streamify")
let browserify = require("browserify")


@Gulpclass()
export class Gulpfile {

  @Task()
  markup() {
		return gulp
			.src(["./src/**.pug"])
			.pipe(pug())
      .pipe(inline({rootpath: './dist', compress: false}))
       // .pipe(inline({
         // base: './dist/',
         // js: uglify
       // }))
			.pipe(gulp.dest("./dist"))
  }    

  @Task()
  styles() {
		return gulp
			.src(["./src/**.styl"])
			.pipe(stylus())
			.pipe(gulp.dest("./dist"))
  }   

  @Task()
  vendorStyles() {
    return gulp
      .src([
        "./node_modules/bulma/css/bulma.css",
        "./node_modules/bulma-checkradio/dist/css/bulma-checkradio.min.css"
       ])
      .pipe(concat("vendor.css"))
      .pipe(gulp.dest("dist"))
  } 

  @Task()
  scripts() {
    return browserify({ entries: "./src/app.ts" })
      .plugin("tsify", { noImplicitAny: false})     
      .bundle()  
      .pipe(source("app.js"))
      .pipe(streamify(uglify({ mangle: false })))
      .pipe(gulp.dest("./dist"))
  }     

  @Task()
  vendorScripts() {
    return gulp
      .src([
        "./node_modules/es5-shim/es5-shim.min.js",
        "./node_modules/classlist-polyfill/src/index.js",
       ])
      .pipe(concat("vendor.js"))
      .pipe(uglify({ mangle: false }))
      .pipe(gulp.dest("dist"))
  } 

  @SequenceTask()
  compile() {
	  return ["styles", "vendorStyles", "scripts", "vendorScripts", "markup"];
  }         

  @Task()
  serve() {
	  connect.server({
		  root: 'dist'
	  });
  }      

  @Task()
  deploy() {
    return gulp
      .src(['./dist/**/*'])
      .pipe(deploy({
            remoteUrl: "https://eduardsi:${GH_TOKEN}@github.com/devternity/registration.git",
            branch: "gh-pages"
      }));
  }    


	@Task("default", ["compile", "serve"])
  defaultTask() {
  }

}