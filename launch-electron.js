// Launcher script that temporarily hides the npm electron package
// to allow Electron's internal 'electron' module to be resolved
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const electronPkgDir = path.join(__dirname, 'node_modules', 'electron');
const indexJs = path.join(electronPkgDir, 'index.js');
const indexJsBak = path.join(electronPkgDir, 'index.js.launching');
const electronBinary = path.join(electronPkgDir, 'dist', 'electron.exe');

// Rename index.js to hide it from module resolution
if (fs.existsSync(indexJs)) {
    fs.renameSync(indexJs, indexJsBak);
    console.log('Temporarily renamed electron/index.js');
}

// Spawn electron
const child = spawn(electronBinary, ['.'], {
    stdio: 'inherit',
    cwd: __dirname
});

child.on('close', (code) => {
    // Restore index.js
    if (fs.existsSync(indexJsBak)) {
        fs.renameSync(indexJsBak, indexJs);
        console.log('Restored electron/index.js');
    }
    process.exit(code);
});

child.on('error', (err) => {
    // Restore index.js on error
    if (fs.existsSync(indexJsBak)) {
        fs.renameSync(indexJsBak, indexJs);
    }
    console.error('Electron launch error:', err);
    process.exit(1);
});

// Handle ctrl+c
process.on('SIGINT', () => {
    if (fs.existsSync(indexJsBak)) {
        fs.renameSync(indexJsBak, indexJs);
    }
    process.exit();
});
