import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import electronPath from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VITE_PORT = 5174;
const WAIT_TIMEOUT = 30000; // 30 seconds

// Check if dev server is ready
function checkDevServer(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on('error', retry);
    };

    const retry = () => {
      if (Date.now() - start > WAIT_TIMEOUT) {
        reject(new Error('Timeout waiting for dev server'));
      } else {
        setTimeout(check, 1000);
      }
    };

    check();
  });
}

// Start Electron
async function startElectron() {
  try {
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

    if (isDev) {
      console.log(`Waiting for Vite dev server on port ${VITE_PORT}...`);
      await checkDevServer(`http://localhost:${VITE_PORT}`);
      console.log('Dev server ready, launching Electron...');
    }

    const mainPath = path.join(__dirname, 'electron/main.cjs');

    // Pass arguments to the child process
    const args = [mainPath];
    if (isDev) args.push('--dev');

    const child = spawn(electronPath, args, {
      stdio: 'inherit',
      env: process.env
    });

    child.on('close', (code) => {
      process.exit(code ?? 0);
    });

  } catch (error) {
    console.error('Failed to start Electron:', error);
    process.exit(1);
  }
}

startElectron();
