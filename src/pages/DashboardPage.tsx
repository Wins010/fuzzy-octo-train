import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const submissionTrendData = [
  { name: 'Jan', submissions: 12 },
  { name: 'Feb', submissions: 28 },
  { name: 'Mar', submissions: 45 },
  { name: 'Apr', submissions: 67 },
  { name: 'May', submissions: 89 },
  { name: 'Jun', submissions: 124 },
];

const categoryData = [
  { name: 'Machine Learning', value: 35, color: '#636cf1' },
  { name: 'Healthcare AI', value: 25, color: '#d946ef' },
  { name: 'NLP', value: 20, color: '#10b981' },
  { name: 'Computer Vision', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#94a3b8' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { submissions, events, notifications, user } = useStore();

  const stats = [
    {
      label: 'Total Submissions',
      value: submissions.length,
      change: '+12%',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Pending Review',
      value: submissions.filter((s) => s.status === 'pending' || s.status === 'under_review').length,
      change: '+3',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Accepted',
      value: submissions.filter((s) => s.status === 'accepted').length,
      change: '+8%',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Upcoming Events',
      value: events.length,
      change: '2 today',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const recentSubmissions = submissions.slice(0, 5);
  const upcomingEvents = events.slice(0, 3);
  const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-surface-900"
          >
            Welcome back, {user?.name.split(' ')[0]} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mt-1"
          >
            Here's what's happening with your conference
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" onClick={() => navigate('/submissions')}>
            View Submissions
          </Button>
          <Button onClick={() => navigate('/submit')}>
            Submit Abstract
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
            <Card hover className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-surface-900 mt-2">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${stat.textColor}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submission Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submission Trends</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={submissionTrendData}>
                    <defs>
                      <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#636cf1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#636cf1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="submissions"
                      stroke="#636cf1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSubmissions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryData.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-surface-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium text-surface-900">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submissions</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/submissions')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/submissions')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {submission.title}
                      </p>
                      <p className="text-xs text-surface-500">
                        {submission.authors[0].name} • {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 p-2 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-surface-500 truncate">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/schedule')}>
                View Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-surface-100 hover:border-primary-200 hover:shadow-glass transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      event.type === 'keynote' ? 'bg-purple-100 text-purple-700' :
                      event.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'panel' ? 'bg-orange-100 text-orange-700' :
                      'bg-surface-100 text-surface-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <h4 className="font-medium text-surface-900 line-clamp-2 mb-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <Calendar className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
