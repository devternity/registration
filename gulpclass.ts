import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators"

let ts = require("gulp-typescript")
let gulp = require("gulp")
let pug = require("gulp-pug")
let inject = require("gulp-inject")
let concat = require("gulp-concat")
let connect = require("gulp-connect")
let stylus = require("gulp-stylus")
let deploy = require("gulp-gh-pages")
let inline = require('gulp-inline-source')
let source = require("vinyl-source-stream")
let browserify = require("browserify")


@Gulpclass()
export class Gulpfile {

  @Task()
  markup() {
		return gulp
			.src(["./src/**.pug"])
			.pipe(pug())
      .pipe(inline({rootpath: './dist', compress: false}))
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
        "./node_modules/material-design-lite/material.min.css"
       ])
      .pipe(concat("vendor.css"))
      .pipe(gulp.dest("dist"))
  } 

  @Task()
  scripts() {
    return browserify({ entries: "./src/app.ts" })
      .plugin("tsify", { noImplicitAny: false })
      .bundle()  
      .pipe(source("app.js"))
      .pipe(gulp.dest("./dist"))
  }     

  @Task()
  vendorScripts() {
    return gulp
      .src([
        "./node_modules/material-design-lite/material.min.js",
        "./node_modules/classlist-polyfill/src/index.js"
       ])
      .pipe(concat("vendor.js"))
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