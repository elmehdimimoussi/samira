import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { FileText, Users, ClipboardList, Settings, Wallet } from 'lucide-react'
import FillingPage from './pages/FillingPage'
import CustomersPage from './pages/CustomersPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import { ThemeToggle } from './components/ThemeToggle'
// import logo from '../public/logo.png' 

function App() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: FileText, label: 'Remplissage' },
    { path: '/customers', icon: Users, label: 'Clients' },
    { path: '/history', icon: ClipboardList, label: 'Historique' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Wallet size={24} strokeWidth={1.5} />
            </div>
            <div className="sidebar-logo-text">
              <span className="block text-lg font-bold tracking-tight">LC Pro</span>
              <span className="block text-xs text-slate-400 font-medium">Gestionnaire</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="w-6 flex justify-center">
                <item.icon size={20} strokeWidth={1.5} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FillingPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
