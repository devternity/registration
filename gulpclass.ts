import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators"

let ts = require("gulp-typescript")
let gulp = require("gulp")
let pug = require("gulp-pug")
let inject = require("gulp-inject")
let concat = require("gulp-concat")
let connect = require("gulp-connect")
let stylus = require("gulp-stylus")
let deploy = require("gulp-gh-pages")
let source = require("vinyl-source-stream")
let browserify = require("browserify")


@Gulpclass()
export class Gulpfile {

  @Task()
  markup() {
		return gulp
			.src(["./src/**.pug"])
			.pipe(pug())
      // .pipe(inject(sources))
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
        "./node_modules/material-design-lite/material.min.css", 
        "./node_modules/getmdl-select/getmdl-select.min.css"
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
        // "./node_modules/jquery/dist/jquery.min.js"
       ])
      .pipe(concat("vendor.js"))
      .pipe(gulp.dest("dist"))
  } 

  @SequenceTask()
  compile() {
	  return ["markup", "styles", "vendorStyles", "scripts", "vendorScripts"];
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