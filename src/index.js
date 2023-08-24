#!/usr/bin/env node
const path = require('path')

//Babel转码 ES5 
require("@babel/register")({
    extensions: ['.tsx', '.ts', '.js', ".jsx"], // 支持的后缀名的文件
    cache: true,
    cwd: path.join(__dirname, '..'),
    ...require('../babel.config')
})

const { kiwiScript } =  require("./kiwi-script.ts");

const [, bin, script, ...args] = process.argv

kiwiScript(script, { args })