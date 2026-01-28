import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submissions } = useStore();

  // Simulate assigned reviews (filter by user as reviewer)
  const assignedReviews = submissions.filter(
    (s) => s.reviewers?.includes(user?.id || '') && s.status !== 'draft'
  );

  const completedReviews = assignedReviews.filter(
    (s) => s.reviews?.some((r) => r.reviewerId === user?.id)
  );

  const pendingReviews = assignedReviews.filter(
    (s) => !s.reviews?.some((r) => r.reviewerId === user?.id)
  );

  const stats = [
    {
      label: 'Assigned Reviews',
      value: assignedReviews.length,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Pending Reviews',
      value: pendingReviews.length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
    },
    {
      label: 'Completed',
      value: completedReviews.length,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Avg. Score Given',
      value: '7.8',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
    },
  ];

  const upcomingDeadlines = pendingReviews
    .map((submission) => ({
      ...submission,
      deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random deadline within 7 days
    }))
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 3);

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
            User ID: <span className="font-mono font-semibold text-primary-600">{user?.uniqueUserId}</span> • Reviewer
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" onClick={() => navigate('/reviews')}>
            Review History
          </Button>
          <Button onClick={() => navigate('/reviews')}>
            Start Review
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

      {/* Urgent Reviews */}
      {upcomingDeadlines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <CardTitle>Urgent Reviews</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 rounded-xl bg-white border border-amber-100 hover:border-amber-300 hover:shadow-glass transition-all cursor-pointer"
                    onClick={() => navigate('/reviews')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-surface-900 mb-1">{submission.title}</h4>
                        <p className="text-sm text-surface-600 mb-2">
                          {submission.authors[0]?.name} • {submission.categories[0]}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">
                            Due {formatDistanceToNow(submission.deadline, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        Review Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Assigned Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Reviews</CardTitle>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/reviews')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedReviews.length > 0 ? (
                assignedReviews.slice(0, 5).map((submission) => {
                  const isReviewed = submission.reviews?.some((r) => r.reviewerId === user?.id);
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer"
                      onClick={() => navigate('/reviews')}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">
                          {submission.title}
                        </p>
                        <p className="text-xs text-surface-500">
                          {submission.authors[0]?.name} • {submission.categories[0]}
                        </p>
                      </div>
                      {isReviewed ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Reviewed</span>
                        </div>
                      ) : (
                        <StatusBadge status="pending" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-surface-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No reviews assigned yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Review Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Review Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-surface-600">Completion Rate</span>
                    <span className="font-semibold text-surface-900">
                      {assignedReviews.length > 0
                        ? Math.round((completedReviews.length / assignedReviews.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                      style={{
                        width: assignedReviews.length > 0
                          ? `${(completedReviews.length / assignedReviews.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-100">
                  <div>
                    <p className="text-sm text-surface-500 mb-1">Total Assigned</p>
                    <p className="text-2xl font-bold text-surface-900">{assignedReviews.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-emerald-600">{completedReviews.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Review Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm font-medium text-blue-900 mb-1">Evaluation Criteria</p>
                  <p className="text-xs text-blue-700">
                    Technical quality, originality, clarity, and relevance
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-sm font-medium text-purple-900 mb-1">Review Timeline</p>
                  <p className="text-xs text-purple-700">
                    Please complete reviews within 14 days of assignment
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm font-medium text-amber-900 mb-1">Confidentiality</p>
                  <p className="text-xs text-amber-700">
                    All submissions are confidential and should not be shared
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
