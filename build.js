#!/usr/bin/env node

/*

BUILD SCRIPT CLI

	node build
		produce a production build

	node build --debug
		produce a debug build

	node build --sassWatch
		engage a sass compile-on-save watch mode session

*/

const commander = require("commander")
const {axx, maxx, raxx, waxx, caxx} = require("axx")

async function build({debug, paths}) {
	const {nb} = paths
	process.env.FORCE_COLOR = true

	await axx(`rm -rf dist && mkdir dist`).result
	await axx(`${nb}tsc${debug ? " --target es6" : ""}`, caxx()).result
}

commander
	.option("-d, --debug", "create a debuggable bundle")
	.parse(process.argv)

build({
	debug: commander.debug,
	paths: {
		nb: "$(npm bin)/",
	}
})
