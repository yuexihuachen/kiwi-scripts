import spawn from "cross-spawn";
import path from "path";
import which from 'which'
import npmWhich from 'npm-which'

/**
 * 
 * @param {String} script 
 * @param {Object} args spawnOptions 
 */
function kiwiScript(script, {
    args = [],
    spawnOptions = {}
}) {
    console.log('************************************************************')
    console.log(JSON.stringify(script))

    const scriptPath = path.join(__dirname, './scripts', script);

    if (!scriptPath) {
        throw new Error(`Unknown script "${script}".`)
    }

    const bin = 'node';
    //const pathFromWhich = which.sync(bin)
    // If executable is found use it.
    // if (pathFromWhich) {
    //     return fullPath ? fs.realpathSync(pathFromWhich) : executable
    // }
    const npmWhichInstance = npmWhich(process.cwd())
    const pathFromWhich = npmWhichInstance.sync(bin)
    console.log('************************************************************')
    console.log(JSON.stringify(pathFromWhich))

    const result = spawn.sync(bin, [scriptPath, ...args], { stdio: 'inherit', ...spawnOptions })

    if (result.signal) {
        process.exit(1)
    } else {
        process.exit(result.status);
    }

    return result;
}

export {
    kiwiScript
} 
