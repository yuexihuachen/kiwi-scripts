const which = require('which');
const npmWhich  = require('npm-which');
const fs = require("fs");
const path = require("path");
const readPkgUp = require('read-pkg-up')

const cwd = process.cwd();

function resolveBin(nodeName,{
    executable = nodeName,
    givenCWD = cwd,
    fullPath = false,
}) {
    const originalCWD = process.cwd()
    try {
        //更改 Node.js 进程的当前工作目录
        process.chdir(givenCWD)
        const pathFromWhich = which.sync(executable)
        if (pathFromWhich) {
            // realpathSync文件的真实路径
            return fullPath ? fs.realpathSync(pathFromWhich) : executable
        }
    } catch (error) {
        // ignore error
    } finally {
        process.chdir(originalCWD)
    }
    try {
        //找到程序或本地安装的节点模块可执行文件
        const npmWhichInstance = npmWhich(givenCWD)
        const pathFromWhich = npmWhichInstance.sync(executable)
        if (pathFromWhich) {
            // 可执行文件真实目录
            const realPathFromWhich = fs.realpathSync(pathFromWhich)
            return fullPath
                ? realPathFromWhich
                : realPathFromWhich.replace(givenCWD, '.') // 可执行文件相对目录
        }
    } catch (error) {
        // ignore error
    }
    // 没有找到node可执行文件
    // console.log('************************************************************')
    // console.log(__dirname, fullPathToBin.replace(__dirname, '.'))
    return nodeName
}

function getUtils(cwd = process.cwd()) {
    const { path: pkgPath } = readPkgUp.sync({
        cwd: fs.realpathSync(cwd),
    })

    const rootDir = path.dirname(pkgPath || cwd)
    
    const fromRoot = (...p) => path.join(rootDir, ...p)

    const hasFile = (...p) => fs.existsSync(fromRoot(...p))

    const firstFile = (...files) => {
        const file = files.find((f) => hasFile(f))
        
        if (file) {
            return fromRoot(file)
        } else {
            return null
        }
    }

    const isTypeScript =
        hasFile('tsconfig.json') ||
        hasFile('client/tsconfig.json') ||
        hasFile('server/tsconfig.json')

    const isApp = true
    return {
        isTypeScript,
        rootDir,
        fromRoot,
        hasFile,
        firstFile,
        isApp
    }
}

const defaultUtils = getUtils()


function utilsFor(subdir = 'client') {
    let subDirUtils = defaultUtils
    
    if (defaultUtils.isApp) {
      subDirUtils = getUtils(subDirUtils.fromRoot(subdir))
    }
    return subDirUtils
}

function removeEmpty(input) {
    if (Array.isArray(input)) {
        return input.filter((item) => item != null)
    } else {
        return Object.entries(input).reduce(
            (a, [k, v]) => {
                if (v != null) {
                    a[k] = v
                }
                return a
            },
            {},
        )
    }
}

  module.exports = {
    resolveBin,
    getUtils,
    utilsFor,
    removeEmpty
}