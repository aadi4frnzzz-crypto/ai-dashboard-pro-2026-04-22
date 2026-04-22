/**
 * useAppStore.ts - Global State Management with Zustand
 * 
 * Zustand is used by top 1% senior devs because:
 * - No boilerplate (unlike Redux)
 * - TypeScript-first
 * - Works outside React (unlike Context)
 * - Built-in devtools support
 * - Immer integration for immutable updates
 */
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type Theme = 'light' | 'dark' | 'system'
type Page = 'dashboard' | 'analytics' | 'users' | 'settings'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: Date
}

interface AppState {
  // UI State
  theme: Theme
  currentPage: Page
  sidebarOpen: boolean
  notifications: Notification[]
  
  // User State
  user: {
    name: string
    email: string
    avatar: string
    role: string
  } | null

  // Actions
  setTheme: (theme: Theme) => void
  setCurrentPage: (page: Page) => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void
  setUser: (user: AppState['user']) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial State
        theme: 'dark',
        currentPage: 'dashboard',
        sidebarOpen: true,
        notifications: [],
        user: {
          name: 'Mohit Singh',
          email: 'mohit@aidashboard.pro',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohit',
          role: 'Senior Developer',
        },

        // Actions using Immer for immutable updates
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),

        setCurrentPage: (page) =>
          set((state) => {
            state.currentPage = page
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),

        addNotification: (notification) =>
          set((state) => {
            state.notifications.unshift({
              ...notification,
              id: crypto.randomUUID(),
              read: false,
              timestamp: new Date(),
            })
          }),

        markNotificationRead: (id) =>
          set((state) => {
            const notif = state.notifications.find((n) => n.id === id)
            if (notif) notif.read = true
          }),

        clearAllNotifications: () =>
          set((state) => {
            state.notifications = []
          }),

        setUser: (user) =>
          set((state) => {
            state.user = user
          }),

        logout: () =>
          set((state) => {
            state.user = null
            state.notifications = []
          }),
      })),
      {
        name: 'ai-dashboard-store', // localStorage key
        partialize: (state) => ({
          theme: state.theme,
          user: state.user,
        }),
      }
    ),
    { name: 'AI Dashboard Store' } // Redux DevTools label
  )
)
