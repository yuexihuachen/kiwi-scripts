import spawn from "cross-spawn";
import path from "path";
import { resolveBin } from "./utils";


interface Env {
    [key: string]: string
}

type ScriptOptios = {
    args?: string[]
    spawnOptions?: {
        env?: Env
    }
}

function kiwiScript(script: string, {
    args = [],
    spawnOptions = {}
}: ScriptOptios = {}) {

    
    const scriptPath = path.join(__dirname, './scripts', script);

    if (!scriptPath) {
        throw new Error(`Unknown script "${script}".`)
    }
    
    const bin = resolveBin('node');
    // console.log('************************************************************')
    // console.log(scriptPath)
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
