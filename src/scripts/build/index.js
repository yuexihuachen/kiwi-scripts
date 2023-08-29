require("../../babel-register")
const path = require("path");
const { hasFile } = require("../../utils")

const args = process.argv.slice(2)
const here = (p) => path.join(__dirname, p)

const isApp = hasFile('client/package.json');
console.log(...['--config', here('../../config/webpack.config')])
if (isApp) {
    require('./client')
} else {
    require('./babel')
}

