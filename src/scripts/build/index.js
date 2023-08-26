require("../../babel-register")

const spawn = require("cross-spawn");
const { hasFile, resolveBin } = require("../../utils")

const args = process.argv.slice(2)

const isApp = hasFile('client/package.json')
if (isApp) {
    const result = spawn.sync(
        resolveBin('webapck'),
        {
            stdio: 'inherit',
            env: {
            },
        },
    )

    process.exit(result.status)
} else {
    require('./babel')
}

