import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  CheckCircle,
  Clock,
  Star,
  Download,
  Calendar,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const submissionData = [
  { month: 'Jan', submissions: 45, accepted: 32, rejected: 8 },
  { month: 'Feb', submissions: 62, accepted: 48, rejected: 12 },
  { month: 'Mar', submissions: 78, accepted: 55, rejected: 15 },
  { month: 'Apr', submissions: 95, accepted: 68, rejected: 18 },
  { month: 'May', submissions: 124, accepted: 89, rejected: 22 },
  { month: 'Jun', submissions: 156, accepted: 112, rejected: 28 },
];

const reviewerData = [
  { name: 'Dr. Alex Thompson', assigned: 15, completed: 12, avgScore: 7.8 },
  { name: 'Prof. Jennifer Wu', assigned: 12, completed: 10, avgScore: 8.2 },
  { name: 'Dr. Michael Chen', assigned: 18, completed: 16, avgScore: 7.5 },
  { name: 'Prof. Sarah Johnson', assigned: 10, completed: 8, avgScore: 8.5 },
  { name: 'Dr. Robert Kim', assigned: 14, completed: 14, avgScore: 7.9 },
];

const categoryData = [
  { name: 'Machine Learning', count: 45, color: '#636cf1' },
  { name: 'Healthcare AI', count: 32, color: '#d946ef' },
  { name: 'NLP', count: 28, color: '#10b981' },
  { name: 'Computer Vision', count: 22, color: '#f59e0b' },
  { name: 'Ethics', count: 15, color: '#ef4444' },
  { name: 'Others', count: 14, color: '#94a3b8' },
];

const registrationData = [
  { week: 'Week 1', registrations: 45, revenue: 13500 },
  { week: 'Week 2', registrations: 62, revenue: 18600 },
  { week: 'Week 3', registrations: 78, revenue: 23400 },
  { week: 'Week 4', registrations: 95, revenue: 28500 },
  { week: 'Week 5', registrations: 120, revenue: 36000 },
  { week: 'Week 6', registrations: 145, revenue: 43500 },
];

export default function AnalyticsPage() {
  const stats = [
    {
      label: 'Total Submissions',
      value: '156',
      change: '+23%',
      trending: 'up',
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Acceptance Rate',
      value: '72%',
      change: '+5%',
      trending: 'up',
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      label: 'Avg Review Score',
      value: '7.8',
      change: '+0.3',
      trending: 'up',
      icon: Star,
      color: 'amber',
    },
    {
      label: 'Total Registrations',
      value: '423',
      change: '+18%',
      trending: 'up',
      icon: Users,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-surface-900"
          >
            Analytics & Reports
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mt-1"
          >
            Track conference metrics and generate reports
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>
            Last 30 Days
          </Button>
          <Button leftIcon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-surface-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trending === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trending === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-surface-400">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Submission Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={submissionData}>
                    <defs>
                      <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#636cf1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#636cf1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="submissions" stroke="#636cf1" fillOpacity={1} fill="url(#colorSub)" name="Submissions" />
                    <Area type="monotone" dataKey="accepted" stroke="#10b981" fillOpacity={1} fill="url(#colorAcc)" name="Accepted" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Submissions by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-surface-600">{cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-surface-900">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Registration Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Registration & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Registrations'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="registrations" fill="#636cf1" name="Registrations" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#d946ef" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviewer Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reviewer Activity</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100">
                    <th className="text-left py-3 text-sm font-semibold text-surface-500">Reviewer</th>
                    <th className="text-center py-3 text-sm font-semibold text-surface-500">Assigned</th>
                    <th className="text-center py-3 text-sm font-semibold text-surface-500">Completed</th>
                    <th className="text-center py-3 text-sm font-semibold text-surface-500">Completion Rate</th>
                    <th className="text-center py-3 text-sm font-semibold text-surface-500">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewerData.map((reviewer, index) => (
                    <tr key={index} className="border-b border-surface-50 last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-medium">
                            {reviewer.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-surface-900">{reviewer.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm text-surface-600">{reviewer.assigned}</td>
                      <td className="py-4 text-center text-sm text-surface-600">{reviewer.completed}</td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-surface-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                              style={{ width: `${(reviewer.completed / reviewer.assigned) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-surface-600">
                            {Math.round((reviewer.completed / reviewer.assigned) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                          <Star className="w-3 h-3" />
                          {reviewer.avgScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
