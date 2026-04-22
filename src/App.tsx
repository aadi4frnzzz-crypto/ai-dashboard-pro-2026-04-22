import { Suspense, lazy, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import {
  LayoutDashboard, BarChart2, Users, Settings,
  Menu, X, Bell, Sun, Moon, User
} from 'lucide-react'

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))
const UsersPage = lazy(() => import('./pages/Users'))
const SettingsPage = lazy(() => import('./pages/Settings'))

const pages: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  dashboard: Dashboard,
  analytics: Analytics,
  users: UsersPage,
  settings: SettingsPage,
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const { currentPage, setCurrentPage, theme, setTheme, user } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const PageComponent = pages[currentPage] || Dashboard

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} h-screen flex overflow-hidden bg-slate-950`}>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border-r border-slate-800 flex-shrink-0 overflow-hidden"
      >
        <div className="w-60 h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">AI Dashboard Pro</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-slate-400 text-xs truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-white font-semibold capitalize">{currentPage}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.18 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <PageComponent />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
