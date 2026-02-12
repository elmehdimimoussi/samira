import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { FileText, Users, ClipboardList, Settings, Wallet } from 'lucide-react'
import FillingPage from './pages/FillingPage'
import CustomersPage from './pages/CustomersPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: FileText, label: 'Remplissage', desc: 'Créer une LC' },
    { path: '/customers', icon: Users, label: 'Clients', desc: 'Base de données' },
    { path: '/history', icon: ClipboardList, label: 'Historique', desc: 'Opérations passées' },
    { path: '/settings', icon: Settings, label: 'Paramètres', desc: 'Configuration' },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Toaster position="top-right" richColors closeButton />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
              <Wallet size={22} strokeWidth={1.5} />
            </div>
            <div className="sidebar-logo-text">
              <span className="block text-base font-bold tracking-tight">LC Pro</span>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">Gestionnaire BMCI</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="h-px bg-slate-100 dark:bg-slate-800" />
        </div>

        <nav className="sidebar-nav">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="w-6 flex justify-center nav-icon">
                <item.icon size={19} strokeWidth={1.5} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="px-4 pb-2">
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="p-3">
            <ThemeToggle />
          </div>
          <div className="px-5 pb-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-600">v1.0.0 — IGADOR SAMIRA</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FillingPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
