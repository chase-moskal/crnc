#!/usr/bin/env node

/*

BUILD SCRIPT CLI

	node build
		produce a production build

	node build --debug
		produce a debug build

*/

const {axx, caxx} = require("axx")
const commander = require("commander")

async function build({debug, paths}) {
	const {nb} = paths
	process.env.FORCE_COLOR = true

	await axx(`rm -rf dist && mkdir dist`)
	await axx(`${nb}tsc${debug ? " --target es6" : ""}`, caxx())
	await axx(`${nb}browserify -p [ tsify ] source/global.ts > dist/global.bundle.js`)
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
