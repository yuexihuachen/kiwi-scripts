import spawn from "cross-spawn";
import path from "path";
import {resolveBin} from "./utils"

/**
 * 
 * @param {String} script 
 * @param {Object} args spawnOptions 
 */
function kiwiScript(script, {
    args = [],
    spawnOptions = {}
}) {


    const scriptPath = path.join(__dirname, './scripts', script);

    if (!scriptPath) {
        throw new Error(`Unknown script "${script}".`)
    }

    const bin = resolveBin('node');
    
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
