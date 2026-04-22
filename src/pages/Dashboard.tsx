/**
 * Dashboard.tsx - Main Dashboard Page
 * 
 * Libraries in use:
 * - TanStack Query: Async state management, auto-refetching
 * - Recharts: Composable, declarative charts (used by Vercel, Linear)
 * - Framer Motion: Physics-based animations
 * - date-fns: Tree-shakable date utilities
 * - lucide-react: Beautiful, consistent icon set
 */
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ShoppingCart } from 'lucide-react'
import { format, subDays } from 'date-fns'

// --- Mock API fetchers (replace with real API calls) ---
const fetchDashboardStats = async () => {
  await new Promise((r) => setTimeout(r, 500)) // Simulate network
  return {
    totalRevenue: 284750,
    revenueChange: +12.5,
    totalUsers: 14823,
    usersChange: +8.2,
    activeProjects: 47,
    projectsChange: -2.1,
    transactions: 1293,
    transactionsChange: +18.7,
  }
}

const fetchRevenueChart = async () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    revenue: Math.floor(Math.random() * 15000 + 5000),
    expenses: Math.floor(Math.random() * 8000 + 2000),
  }))
}

const fetchPieData = async () => [
  { name: 'Direct', value: 35, color: '#6366f1' },
  { name: 'Organic', value: 28, color: '#8b5cf6' },
  { name: 'Referral', value: 20, color: '#a78bfa' },
  { name: 'Social', value: 17, color: '#c4b5fd' },
]

// Reusable stat card component
const StatCard = ({ title, value, change, icon: Icon, prefix = '' }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
  >
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm font-medium">{title}</span>
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold text-foreground">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className={`text-sm mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {Math.abs(change)}% from last month
      </p>
    </div>
  </motion.div>
)

export default function Dashboard() {
  // TanStack Query - declarative data fetching with caching
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  const { data: revenueData = [] } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: fetchRevenueChart,
  })

  const { data: pieData = [] } = useQuery({
    queryKey: ['pie-data'],
    queryFn: fetchPieData,
  })

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 h-36 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards - 4 column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={stats?.totalRevenue} change={stats?.revenueChange} icon={DollarSign} prefix="$" />
        <StatCard title="Total Users" value={stats?.totalUsers} change={stats?.usersChange} icon={Users} />
        <StatCard title="Active Projects" value={stats?.activeProjects} change={stats?.projectsChange} icon={Activity} />
        <StatCard title="Transactions" value={stats?.transactions} change={stats?.transactionsChange} icon={ShoppingCart} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Revenue vs Expenses (Recharts) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#colorExpenses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Traffic Sources */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry: any, index: number) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
