/**
 * Settings.tsx - React Hook Form + Zod + Zustand
 * Full settings page with validated form and theme switching
 */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAppStore } from '../store/useAppStore'
import { Save, Moon, Sun, Monitor } from 'lucide-react'

const settingsSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  language: z.enum(['en', 'hi', 'es', 'fr', 'de']),
  timezone: z.string(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyReport: z.boolean(),
})

type SettingsForm = z.infer<typeof settingsSchema>

export default function Settings() {
  const { theme, setTheme, user } = useAppStore()

  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: user?.name || '',
      email: user?.email || '',
      bio: '',
      language: 'en',
      timezone: 'Asia/Kolkata',
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true,
    },
  })

  const onSubmit = async (data: SettingsForm) => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Settings saved successfully!')
    console.log('Settings saved:', data)
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>

      {/* Theme Selector - Zustand powered */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>
        <div className="flex gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                theme === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Form - React Hook Form + Zod */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Display Name</label>
          <input
            {...register('displayName')}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.displayName && <p className="text-xs text-destructive">{errors.displayName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            {...register('bio')}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
          {[
            { name: 'emailNotifications' as const, label: 'Email Notifications' },
            { name: 'pushNotifications' as const, label: 'Push Notifications' },
            { name: 'weeklyReport' as const, label: 'Weekly Report' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer">
              <input
                {...register(name)}
                type="checkbox"
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </motion.div>
  )
}
