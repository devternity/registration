eval(
	require("typescript").transpile(require("fs").readFileSync("./gulpclass.ts").toString())
);