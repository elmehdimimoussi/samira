const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let db = null;

// Simple JSON-based database
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
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Auto-increment ID helper
  getNextId(collection) {
    const items = this.data[collection] || [];
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }
}

// Database initialization
function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'lc-bmci-data.json');
  db = new JsonDatabase(dbPath);
  console.log('Database initialized at:', dbPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'default',
    show: false
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5174');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for database operations

// Customers
ipcMain.handle('customers:getAll', () => {
  return db.data.customers.sort((a, b) => a.name.localeCompare(b.name));
});

ipcMain.handle('customers:search', (event, query) => {
  const q = query.toLowerCase();
  return db.data.customers.filter(c =>
    c.name.toLowerCase().includes(q)
  ).sort((a, b) => a.name.localeCompare(b.name));
});

ipcMain.handle('customers:add', (event, customer) => {
  const newCustomer = {
    id: db.getNextId('customers'),
    ...customer,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data.customers.push(newCustomer);
  db.save();
  return newCustomer;
});

ipcMain.handle('customers:update', (event, customer) => {
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
});

ipcMain.handle('customers:delete', (event, id) => {
  db.data.customers = db.data.customers.filter(c => c.id !== id);
  db.save();
  return true;
});

// Operations
ipcMain.handle('operations:getAll', () => {
  return db.data.operations.sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );
});

ipcMain.handle('operations:search', (event, filters) => {
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

  return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

ipcMain.handle('operations:add', (event, operation) => {
  const newOperation = {
    id: db.getNextId('operations'),
    ...operation,
    created_at: new Date().toISOString()
  };
  db.data.operations.push(newOperation);
  db.save();
  return newOperation;
});

ipcMain.handle('operations:delete', (event, id) => {
  db.data.operations = db.data.operations.filter(o => o.id !== id);
  db.save();
  return true;
});

ipcMain.handle('operations:getById', (event, id) => {
  return db.data.operations.find(o => o.id === id) || null;
});

// Template Frames
ipcMain.handle('frames:getAll', () => {
  return db.data.frames.sort((a, b) => (a.z_index || 0) - (b.z_index || 0));
});

ipcMain.handle('frames:save', (event, frames) => {
  db.data.frames = frames.map((frame, index) => ({
    ...frame,
    z_index: index
  }));
  db.save();
  return true;
});

// Settings
ipcMain.handle('settings:get', (event, key) => {
  return db.data.settings[key] || null;
});

ipcMain.handle('settings:set', (event, key, value) => {
  db.data.settings[key] = value;
  db.save();
  return true;
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
