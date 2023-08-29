
const spawn = require("cross-spawn");
const yargsParser = require('yargs-parser')
const { firstFile } = require("../../utils");

const args = process.argv.slice(2)
const parsedArgs = yargsParser(args)

const outDir = parsedArgs.outDir || 'dist'
const outDirArg = ['--out-dir', outDir]

const babelResult = spawn.sync('babel', [
  'src',
  ...outDirArg,
  ...['--ignore', '**/__tests__/**,**/__mocks__/**'],
  ...['--extensions', '.js,.ts,.tsx']
], {
  stdio: 'inherit',
})

if (babelResult.status !== 0) {
  process.exit(babelResult.status)
}


const result = spawn.sync(
  'tsc',
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
