import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy loading with React.lazy - code splitting best practice
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Users = lazy(() => import('./pages/Users'))
const Settings = lazy(() => import('./pages/Settings'))

const pageComponents: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  dashboard: Dashboard,
  analytics: Analytics,
  users: Users,
  settings: Settings,
}

export default function App() {
  const { currentPage, theme } = useAppStore()
  const PageComponent = pageComponents[currentPage] || Dashboard

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} h-screen flex overflow-hidden bg-background`}>
      {/* Sidebar - persistent navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Page content with Framer Motion page transitions */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full"
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
