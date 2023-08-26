const spawn = require("cross-spawn");
const { firstFile, resolveBin } = require("../../utils")

const result = spawn.sync(
  resolveBin('typescript',{ executable: 'tsc' }),
  [
    '--declaration',
    '--noEmit',
    'false',
    '--emitDeclarationOnly',
    '--declarationDir',
    './dist',
    '--project',
    firstFile('tsconfig.json'),
  ],
  {
      stdio: 'inherit'
  },
)

process.exit(result.status)
