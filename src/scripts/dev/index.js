const spawn = require("cross-spawn");

const scripts = {
    client: `node dev/client `,
    server: `node dev/server `,
}

const options = [
    '--kill-others-on-fail',
    '--handle-input',
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    ...Object.values(scripts).map(s => JSON.stringify(s))
  ]

const result = spawn.sync(
    ('concurrently'),
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