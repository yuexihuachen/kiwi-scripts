require("../../babel-register")
const path = require("path");
const spawn = require("cross-spawn");
const { hasFile, fromRoot } = require("../../utils")

const here = (p) => path.join(__dirname, p)

const webpackConfig = hasFile('webpack.config.js')
  ? fromRoot('webpack.config.js')
  : here('../../config/webpack.config')

const result = spawn.sync(
    'webpack',
    [
        ...['serve','--config', webpackConfig]
    ],
    {
        stdio: 'inherit',
    }
)

process.exit(result.status)