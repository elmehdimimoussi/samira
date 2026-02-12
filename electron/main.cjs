const { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// ─── Configuration ──────────────────────────────────────────────────
const APP_CONFIG = {
  name: 'LC Pro',
  width: 1400,
  height: 900,
  minWidth: 1200,
  minHeight: 700,
  splashWidth: 420,
  splashHeight: 320,
};

let mainWindow = null;
let splashWindow = null;
let tray = null;
let db = null;
let isQuitting = false;

// ─── Single Instance Lock ───────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// ─── App Metadata ───────────────────────────────────────────────────
app.setAppUserModelId('com.igador.lcbmci');
if (process.platform === 'win32') {
  app.setName(APP_CONFIG.name);
}

// ─── JSON Database ──────────────────────────────────────────────────
class JsonDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {
      customers: [],
      operations: [],
      frames: [],
      settings: {}
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(content);
        this.data.customers = this.data.customers || [];
        this.data.operations = this.data.operations || [];
        this.data.frames = this.data.frames || [];
        this.data.settings = this.data.settings || {};
      }
    } catch (error) {
      console.error('Error loading database:', error);
      if (fs.existsSync(this.filePath)) {
        const backupPath = this.filePath + '.backup-' + Date.now();
        fs.copyFileSync(this.filePath, backupPath);
        console.log('Backup created at:', backupPath);
      }
    }
  }

  save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempPath = this.filePath + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  getNextId(collection) {
    const items = this.data[collection] || [];
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }
}

// ─── Database Initialization ────────────────────────────────────────
function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'lc-bmci-data.json');
  db = new JsonDatabase(dbPath);
  console.log('Database initialized at:', dbPath);
}

// ─── Get Icon Path ──────────────────────────────────────────────────
function getIconPath() {
  if (app.isPackaged) {
    const icoPath = path.join(process.resourcesPath, 'build', 'icon.ico');
    const pngPath = path.join(process.resourcesPath, 'build', 'icon.png');
    if (fs.existsSync(icoPath)) return icoPath;
    if (fs.existsSync(pngPath)) return pngPath;
    return path.join(__dirname, '..', 'build', 'icon.ico');
  }
  const devIco = path.join(__dirname, '..', 'build', 'icon.ico');
  const devPng = path.join(__dirname, '..', 'build', 'icon.png');
  const devSvg = path.join(__dirname, '..', 'build', 'icon.svg');
  if (fs.existsSync(devIco)) return devIco;
  if (fs.existsSync(devPng)) return devPng;
  if (fs.existsSync(devSvg)) return devSvg;
  return undefined;
}

// ─── Splash Screen ──────────────────────────────────────────────────
function createSplashWindow() {
  const iconPath = getIconPath();

  splashWindow = new BrowserWindow({
    width: APP_CONFIG.splashWidth,
    height: APP_CONFIG.splashHeight,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    center: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));

  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
  });

  splashWindow.on('close', (e) => {
    if (!isQuitting && mainWindow && !mainWindow.isVisible()) {
      e.preventDefault();
    }
  });
}

// ─── Main Window ────────────────────────────────────────────────────
function createMainWindow() {
  const iconPath = getIconPath();

  mainWindow = new BrowserWindow({
    width: APP_CONFIG.width,
    height: APP_CONFIG.height,
    minWidth: APP_CONFIG.minWidth,
    minHeight: APP_CONFIG.minHeight,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: 'default',
    title: APP_CONFIG.name,
    show: false,
    backgroundColor: '#0f172a',
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174').catch(err => {
      console.error('Failed to load URL:', err);
    });
    if (process.env.OPEN_DEVTOOLS === '1') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Fallback timeout in case ready-to-show never fires
  const fallbackTimeout = setTimeout(() => {
    console.log('Fallback: Showing main window after timeout');
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  }, 10000); // Show after 10 seconds max

  mainWindow.once('ready-to-show', () => {
    clearTimeout(fallbackTimeout);
    console.log('Main window ready to show');
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
        splashWindow = null;
      }
      mainWindow.show();

      if (process.platform === 'win32') {
        mainWindow.setOpacity(0);
        let opacity = 0;
        const fadeIn = setInterval(() => {
          if (!mainWindow || mainWindow.isDestroyed()) {
            clearInterval(fadeIn);
            return;
          }
          opacity += 0.1;
          if (opacity >= 1) {
            mainWindow.setOpacity(1);
            clearInterval(fadeIn);
          } else {
            mainWindow.setOpacity(opacity);
          }
        }, 20);
      }
    }, 800);
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isLocal = url.startsWith('http://localhost') || url.startsWith('file://');
    if (!isLocal) {
      event.preventDefault();
      if (url.startsWith('https:')) {
        shell.openExternal(url);
      }
    }
  });
}

// ─── System Tray ────────────────────────────────────────────────────
function createTray() {
  const iconPath = getIconPath();
  if (!iconPath) return;

  try {
    let trayIcon = nativeImage.createFromPath(iconPath);

    if (!trayIcon.isEmpty()) {
      trayIcon = trayIcon.resize({ width: 16, height: 16 });
    }

    tray = new Tray(trayIcon);
    tray.setToolTip('LC Pro — Gestionnaire de Lettres de Change');

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Ouvrir LC Pro',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      { type: 'separator' },
      {
        label: 'À propos',
        click: () => {
          dialog.showMessageBox(mainWindow || null, {
            type: 'info',
            title: 'À propos de LC Pro',
            message: 'LC Pro — Gestionnaire de Lettres de Change',
            detail: `Version: ${app.getVersion()}\nAuteur: IGADOR SAMIRA\n\nApplication de gestion de lettres de change BMCI.`,
            buttons: ['OK']
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Quitter',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (error) {
    console.warn('Could not create tray icon:', error.message);
  }
}

// ─── App Lifecycle ──────────────────────────────────────────────────
app.whenReady().then(() => {
  initDatabase();
  createSplashWindow();
  createTray();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ─── IPC Handlers ───────────────────────────────────────────────────

// Customers
ipcMain.handle('customers:getAll', () => {
  try {
    return db.data.customers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (error) {
    console.error('Error in customers:getAll:', error);
    return [];
  }
});

ipcMain.handle('customers:search', (event, query) => {
  try {
    const q = (query || '').toLowerCase();
    return db.data.customers.filter(c =>
      (c.name || '').toLowerCase().includes(q)
    ).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (error) {
    console.error('Error in customers:search:', error);
    return [];
  }
});

ipcMain.handle('customers:add', (event, customer) => {
  try {
    const newCustomer = {
      id: db.getNextId('customers'),
      ...customer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.data.customers.push(newCustomer);
    db.save();
    return newCustomer;
  } catch (error) {
    console.error('Error in customers:add:', error);
    return null;
  }
});

ipcMain.handle('customers:update', (event, customer) => {
  try {
    const index = db.data.customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      db.data.customers[index] = {
        ...db.data.customers[index],
        ...customer,
        updated_at: new Date().toISOString()
      };
      db.save();
      return db.data.customers[index];
    }
    return null;
  } catch (error) {
    console.error('Error in customers:update:', error);
    return null;
  }
});

ipcMain.handle('customers:delete', (event, id) => {
  try {
    db.data.customers = db.data.customers.filter(c => c.id !== id);
    db.save();
    return true;
  } catch (error) {
    console.error('Error in customers:delete:', error);
    return false;
  }
});

// Operations
ipcMain.handle('operations:getAll', () => {
  try {
    return db.data.operations.sort((a, b) =>
      new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  } catch (error) {
    console.error('Error in operations:getAll:', error);
    return [];
  }
});

ipcMain.handle('operations:search', (event, filters) => {
  try {
    let results = [...db.data.operations];

    if (filters.beneficiary) {
      const q = filters.beneficiary.toLowerCase();
      results = results.filter(o =>
        o.beneficiary_name && o.beneficiary_name.toLowerCase().includes(q)
      );
    }
    if (filters.dateFrom) {
      results = results.filter(o => o.creation_date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      results = results.filter(o => o.creation_date <= filters.dateTo);
    }

    return results.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  } catch (error) {
    console.error('Error in operations:search:', error);
    return [];
  }
});

ipcMain.handle('operations:add', (event, operation) => {
  try {
    const newOperation = {
      id: db.getNextId('operations'),
      ...operation,
      created_at: new Date().toISOString()
    };
    db.data.operations.push(newOperation);
    db.save();
    return newOperation;
  } catch (error) {
    console.error('Error in operations:add:', error);
    return null;
  }
});

ipcMain.handle('operations:delete', (event, id) => {
  try {
    db.data.operations = db.data.operations.filter(o => o.id !== id);
    db.save();
    return true;
  } catch (error) {
    console.error('Error in operations:delete:', error);
    return false;
  }
});

ipcMain.handle('operations:getById', (event, id) => {
  try {
    return db.data.operations.find(o => o.id === id) || null;
  } catch (error) {
    console.error('Error in operations:getById:', error);
    return null;
  }
});

// Template Frames
ipcMain.handle('frames:getAll', () => {
  try {
    return db.data.frames.sort((a, b) => (a.z_index || 0) - (b.z_index || 0));
  } catch (error) {
    console.error('Error in frames:getAll:', error);
    return [];
  }
});

ipcMain.handle('frames:save', (event, frames) => {
  try {
    db.data.frames = frames.map((frame, index) => ({
      ...frame,
      z_index: index
    }));
    db.save();
    return true;
  } catch (error) {
    console.error('Error in frames:save:', error);
    return false;
  }
});

// Settings
ipcMain.handle('settings:get', (event, key) => {
  try {
    return db.data.settings[key] || null;
  } catch (error) {
    console.error('Error in settings:get:', error);
    return null;
  }
});

ipcMain.handle('settings:set', (event, key, value) => {
  try {
    db.data.settings[key] = value;
    db.save();
    return true;
  } catch (error) {
    console.error('Error in settings:set:', error);
    return false;
  }
});

// Backup & Restore
ipcMain.handle('backup:export', () => {
  return JSON.stringify(db.data, null, 2);
});

ipcMain.handle('backup:import', (event, jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    db.data = {
      customers: data.customers || [],
      operations: data.operations || [],
      frames: data.frames || [],
      settings: data.settings || {}
    };
    db.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Generate reference number
ipcMain.handle('operations:generateRef', () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const prefix = `${year}${month}`;
  const existingCount = db.data.operations.filter(o =>
    o.reference_number && o.reference_number.startsWith(prefix)
  ).length;

  return `${prefix}${String(existingCount + 1).padStart(4, '0')}`;
});

// App info
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getPath', (event, name) => {
  return app.getPath(name);
});