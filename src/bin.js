#!/usr/bin/env node
const {kiwiScript} = require('./kiwi-script')

const [, bin, script, ...args] = process.argv

kiwiScript(script, { args })