const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Customers
    customers: {
        getAll: () => ipcRenderer.invoke('customers:getAll'),
        search: (query) => ipcRenderer.invoke('customers:search', query),
        add: (customer) => ipcRenderer.invoke('customers:add', customer),
        update: (customer) => ipcRenderer.invoke('customers:update', customer),
        delete: (id) => ipcRenderer.invoke('customers:delete', id)
    },

    // Operations
    operations: {
        getAll: () => ipcRenderer.invoke('operations:getAll'),
        search: (filters) => ipcRenderer.invoke('operations:search', filters),
        add: (operation) => ipcRenderer.invoke('operations:add', operation),
        delete: (id) => ipcRenderer.invoke('operations:delete', id),
        getById: (id) => ipcRenderer.invoke('operations:getById', id),
        generateRef: () => ipcRenderer.invoke('operations:generateRef')
    },

    // Template Frames
    frames: {
        getAll: () => ipcRenderer.invoke('frames:getAll'),
        save: (frames) => ipcRenderer.invoke('frames:save', frames)
    },

    // Settings
    settings: {
        get: (key) => ipcRenderer.invoke('settings:get', key),
        set: (key, value) => ipcRenderer.invoke('settings:set', key, value)
    },

    // Backup
    backup: {
        export: () => ipcRenderer.invoke('backup:export'),
        import: (jsonData) => ipcRenderer.invoke('backup:import', jsonData)
    }
});
