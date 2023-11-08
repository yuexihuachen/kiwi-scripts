require("../../babel-register")
const path = require("path");
const { utilsFor } = require('../../utils')

const { fromRoot, firstFile, rootDir, hasFile } = utilsFor('client')


const here = (p) => path.join(__dirname, p)

const isApp = hasFile('client/package.json');
console.log(...['--config', here('../../config/webpack.config')])
// if (isApp) {
//     require('./client')
// } else {
//     require('./babel')
// }

require('./client')


