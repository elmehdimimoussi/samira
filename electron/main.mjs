/**
 * NOTE: This file (main.mjs) is kept for reference.
 * The application uses main.cjs as the primary entry point.
 * See electron/main.cjs for the full implementation with:
 * - Splash screen
 * - System tray
 * - Single instance lock
 * - Professional window management
 */

import electron from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { app, BrowserWindow, ipcMain } = electron;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.warn('WARNING: main.mjs is deprecated. Use main.cjs instead.');
console.warn('Update package.json "main" field to "electron/main.cjs"');

app.quit();
