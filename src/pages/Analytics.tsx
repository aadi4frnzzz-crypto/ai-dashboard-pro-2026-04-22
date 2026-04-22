import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { format, subMonths } from 'date-fns'

const fetchAnalyticsData = async () =>
  Array.from({ length: 12 }, (_, i) => ({
    month: format(subMonths(new Date(), 11 - i), 'MMM'),
    pageViews: Math.floor(Math.random() * 50000 + 10000),
    sessions: Math.floor(Math.random() * 30000 + 5000),
    conversions: Math.floor(Math.random() * 500 + 100),
  }))

export default function Analytics() {
  const { data = [], isLoading } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalyticsData })

  if (isLoading) return <div className="bg-card border border-border rounded-xl h-80 animate-pulse" />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">12-month traffic and conversion overview.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Page Views vs Sessions (Bar Chart)</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
            <Legend />
            <Bar dataKey="pageViews" fill="#6366f1" radius={[4, 4, 0, 0]} name="Page Views" />
            <Bar dataKey="sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Sessions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Conversions Trend (Line Chart)</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
            <Legend />
            <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
