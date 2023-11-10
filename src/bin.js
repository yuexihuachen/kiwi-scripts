#!/usr/bin/env node
const runScript = require('./kiwi-script')

const [, bin, script, ...args] = process.argv

runScript(script, { args })

export {}
