require("../../babel-register")
const path = require("path");
const spawn = require("cross-spawn");

const here = (p) => path.join(__dirname, p)

const result = spawn.sync(
    'webpack',
    [
        ...['--config', here('../../config/webpack.config')]
    ],
    {
        stdio: 'inherit',
    },
)

process.exit(result.status)