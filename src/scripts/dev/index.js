const spawn = require("cross-spawn");

const scripts = {
    client: `${('kiwi-scripts')} dev/client`,
    server: `${('kiwi-scripts')} dev/server`,
}
const options = [
    '-k', //Kill other processes if one exits or dies
    '-i', //Whether input should be forwarded to the child processes. See examples for more information.
    '-p', '[{name}-{pid}]',
    '-n', Object.keys(scripts).join(','),
    ...Object.values(scripts).map(s => JSON.stringify(s))
  ]

const result = spawn.sync(
    'concurrently',
    options,
    {
        stdio: 'inherit',
        PORT: '3000',
        CLIENT_PORT: '8000',
        NODE_ENV: 'development',
        CONCURRENTLY: true,
        ...process.env,
    },
)

process.exit(result.status)