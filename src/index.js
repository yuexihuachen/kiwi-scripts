#!/usr/bin/env node
require("./babel-register")
const { kiwiScript } =  require("./kiwi-script.ts");

const [, bin, script, ...args] = process.argv

kiwiScript(script, { args })