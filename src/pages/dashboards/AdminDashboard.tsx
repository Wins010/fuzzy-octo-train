import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  Settings,
  ArrowRight,
  TrendingUp,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submissions, events } = useStore();

  const stats = [
    {
      label: 'Total Submissions',
      value: submissions.length,
      change: '+12%',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Pending Review',
      value: submissions.filter((s) => s.status === 'pending' || s.status === 'under_review').length,
      change: '+3',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
    },
    {
      label: 'Accepted',
      value: submissions.filter((s) => s.status === 'accepted').length,
      change: '+8%',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Total Events',
      value: events.length,
      change: '2 today',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
    },
  ];

  const recentSubmissions = submissions.slice(0, 5);

  const quickActions = [
    {
      label: 'Schedule Management',
      description: 'Manage conference schedule and sessions',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      route: '/schedule',
    },
    {
      label: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      route: '/settings',
    },
    {
      label: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      color: 'from-amber-500 to-orange-500',
      route: '/settings',
    },
    {
      label: 'Analytics',
      description: 'View detailed analytics',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      route: '/analytics',
    },
  ];

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
            User ID: <span className="font-mono font-semibold text-primary-600">{user?.uniqueUserId}</span> • Administrator
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" onClick={() => navigate('/analytics')}>
            View Analytics
          </Button>
          <Button onClick={() => navigate('/schedule')}>
            Manage Schedule
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl border border-surface-100 hover:border-primary-200 hover:shadow-glass transition-all cursor-pointer"
                  onClick={() => navigate(action.route)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-surface-900 mb-1">{action.label}</h4>
                      <p className="text-sm text-surface-500">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-surface-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
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
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((submission) => (
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
                        {submission.authors[0]?.name} • {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-surface-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No submissions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                <UserCheck className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-surface-900">Active Users</p>
                  <p className="text-lg font-bold text-emerald-600">23</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-surface-900">Scheduled Events</p>
                  <p className="text-lg font-bold text-blue-600">{events.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-surface-900">System Health</p>
                  <p className="text-lg font-bold text-purple-600">Excellent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
