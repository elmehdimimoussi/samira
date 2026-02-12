import '@testing-library/jest-dom'

// Mock window.electronAPI used throughout the app
const mockElectronAPI = {
  customers: {
    getAll: vi.fn().mockResolvedValue([]),
    add: vi.fn().mockResolvedValue({ id: 1 }),
    update: vi.fn().mockResolvedValue(true),
    delete: vi.fn().mockResolvedValue(true),
  },
  operations: {
    getAll: vi.fn().mockResolvedValue([]),
    add: vi.fn().mockResolvedValue({ id: 1 }),
    delete: vi.fn().mockResolvedValue(true),
  },
  settings: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(true),
  },
  templates: {
    getAll: vi.fn().mockResolvedValue([]),
    getActive: vi.fn().mockResolvedValue(null),
  },
  frames: {
    getAll: vi.fn().mockResolvedValue([]),
    add: vi.fn().mockResolvedValue({ id: 1 }),
    update: vi.fn().mockResolvedValue(true),
    delete: vi.fn().mockResolvedValue(true),
  },
}

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
})

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value.toString() }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value.toString() }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })

// Mock scrollHeight for accordion animations
Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
  configurable: true,
  get() { return 200 },
})
