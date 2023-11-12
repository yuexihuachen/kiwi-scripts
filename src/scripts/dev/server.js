require("../../babel-register")
const path = require("path");
const spawn = require("cross-spawn");
const { serverDir } = require("../../utils")

console.log('server')

const result = spawn.sync(
    'nodemon',
    [
        '--inspect',
        'index.js'
    ],
    {
        stdio: 'inherit',
        cwd: serverDir
    }
)

process.exit(result.status)