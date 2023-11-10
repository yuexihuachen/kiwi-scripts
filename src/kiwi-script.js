const spawn = require("cross-spawn");
const path = require("path");

function kiwiScript(script, {
    args = [],
    spawnOptions = {}
}) {
    const scriptPath = path.join(__dirname, './scripts', script);

    if (!scriptPath) {
        throw new Error(`Unknown script "${script}".`)
    }
    
    

    const bin = 'node' //resolveBin('node');
    const result = spawn.sync(bin, [scriptPath, ...args], { stdio: 'inherit', ...spawnOptions })

    if (result.signal) {
        process.exit(1)
    } else {
        process.exit(result.status);
    }

    return result;
}

module.exports = {
    kiwiScript
} 
