import { Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'sonner'
import { FileText, Users, ClipboardList, Settings, Wallet } from 'lucide-react'
import FillingPage from './pages/FillingPage'
import CustomersPage from './pages/CustomersPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const navItems = [
    { path: '/', icon: FileText, label: 'Remplissage', desc: 'Créer une LC' },
    { path: '/customers', icon: Users, label: 'Clients', desc: 'Base de données' },
    { path: '/history', icon: ClipboardList, label: 'Historique', desc: 'Opérations passées' },
    { path: '/settings', icon: Settings, label: 'Paramètres', desc: 'Configuration' },
  ]

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Toaster position="top-right" richColors closeButton />

      <header className="topbar">
        <div className="topbar-brand">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
            <Wallet size={20} strokeWidth={1.6} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">LC Pro</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Gestionnaire BMCI</p>
          </div>
        </div>

        <nav className="topbar-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `topbar-nav-item ${isActive ? 'active' : ''}`
              }
              title={item.desc}
            >
              <item.icon size={16} strokeWidth={1.7} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-tools">
          <ThemeToggle />
          <p className="hidden lg:block text-[10px] text-slate-500 dark:text-slate-400">v1.0.0</p>
        </div>
      </header>

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
