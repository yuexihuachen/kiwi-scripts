const path = require('path')

//Babel转码 ES5 
require("@babel/register")({
    extensions: ['.tsx', '.ts', '.js', ".jsx"], // 支持的后缀名的文件
    cache: true,
    cwd: path.join(__dirname, '..'),
    ...require('../babel.config')
})