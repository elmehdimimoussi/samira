import { Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'sonner'
import { FileText, Users, ClipboardList, Settings, Wallet } from 'lucide-react'
import FillingPage from './pages/FillingPage'
import CustomersPage from './pages/CustomersPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import { ThemeToggle } from './components/ThemeToggle'

const NAV_ITEMS = [
  { path: '/', icon: FileText, label: 'Remplissage', description: 'Creer une LC' },
  { path: '/customers', icon: Users, label: 'Clients', description: 'Base de donnees' },
  { path: '/history', icon: ClipboardList, label: 'Historique', description: 'Operations passees' },
  { path: '/settings', icon: Settings, label: 'Parametres', description: 'Configuration' },
]

function App() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Toaster position="top-right" richColors closeButton />

      <header
        data-shell-topbar
        data-testid="app-topbar"
        className="z-40 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/70 bg-white/95 px-3 shadow-sm backdrop-blur-xl md:h-15 md:gap-3 md:px-5 dark:border-slate-800/80 dark:bg-slate-950/95"
      >
        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25">
            <Wallet size={20} strokeWidth={1.6} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">LC Pro</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Gestionnaire BMCI</p>
          </div>
        </div>

        <nav aria-label="Navigation principale" className="min-w-0 flex-1">
          <div
            data-testid="topbar-nav-scroll"
            className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex min-w-full w-max items-center gap-1 whitespace-nowrap pr-2 md:gap-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    title={item.description}
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                    className={({ isActive }) =>
                      `inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:px-3 ${
                        isActive
                          ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-900/25 dark:text-blue-300'
                          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                      }`
                    }
                  >
                    <item.icon size={16} strokeWidth={1.7} aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle compact />
          <p className="hidden text-[10px] text-slate-500 dark:text-slate-400 lg:block">v1.0.0</p>
        </div>
      </header>

      <main className="main-content" data-testid="main-content">
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
