import which from 'which';
import npmWhich from 'npm-which';
import fs from "fs";
import path from "path";
import resolve from "resolve";

const cwd = process.cwd();

function resolveBin(nodeName,options = {}) {
    const {
        givenCWD = cwd,
        fullPath = false,
    } = options
    const originalCWD = process.cwd()
    try {
        //更改 Node.js 进程的当前工作目录
        process.chdir(givenCWD)
        const pathFromWhich = which.sync(nodeName)
        if (pathFromWhich) {
            // realpathSync文件的真实路径
            return fullPath ? fs.realpathSync(pathFromWhich) : nodeName
        }
    } catch (error) {
        // ignore error
    } finally {
        process.chdir(originalCWD)
    }
    try {
        //找到程序或本地安装的节点模块可执行文件
        const npmWhichInstance = npmWhich(givenCWD)
        const pathFromWhich = npmWhichInstance.sync(nodeName)
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
    const modPkgPath = resolve.sync(path.join("..", 'package.json'), {
        basedir: __dirname,
    })
    const modPkgDir = path.dirname(modPkgPath)
    const { bin, name } = require(modPkgPath)

    const binPath = typeof bin === 'string' ? bin : bin[name]
    const fullPathToBin = path.join(modPkgDir, binPath)
    // console.log('************************************************************')
    // console.log(fullPathToBin, fullPathToBin.replace(givenCWD, '.'))
    return fullPath ? fullPathToBin : fullPathToBin.replace(givenCWD, '.')
}

export {
    resolveBin
}