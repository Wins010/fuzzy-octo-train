import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  ArrowRight,
  Upload,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function AuthorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submissions } = useStore();

  // Filter submissions by current user
  const mySubmissions = submissions.filter((s) => s.submittedBy === user?.id);

  const stats = [
    {
      label: 'Total Submissions',
      value: mySubmissions.length,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Under Review',
      value: mySubmissions.filter((s) => s.status === 'pending' || s.status === 'under_review').length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
    },
    {
      label: 'Accepted',
      value: mySubmissions.filter((s) => s.status === 'accepted').length,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Rejected',
      value: mySubmissions.filter((s) => s.status === 'rejected').length,
      icon: XCircle,
      color: 'from-red-500 to-rose-500',
      textColor: 'text-red-600',
    },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          icon: Edit,
          text: 'Continue editing your draft',
          color: 'text-surface-600',
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Awaiting initial review',
          color: 'text-amber-600',
        };
      case 'under_review':
        return {
          icon: Eye,
          text: 'Currently under review',
          color: 'text-blue-600',
        };
      case 'revision_requested':
        return {
          icon: AlertCircle,
          text: 'Revisions requested',
          color: 'text-orange-600',
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          text: 'Congratulations! Accepted',
          color: 'text-emerald-600',
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Not accepted',
          color: 'text-red-600',
        };
      default:
        return {
          icon: FileText,
          text: 'Status unknown',
          color: 'text-surface-600',
        };
    }
  };

  const needsAttention = mySubmissions.filter(
    (s) => s.status === 'draft' || s.status === 'revision_requested'
  );

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
            User ID: <span className="font-mono font-semibold text-primary-600">{user?.uniqueUserId}</span> • Author
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" onClick={() => navigate('/submissions')}>
            View All
          </Button>
          <Button onClick={() => navigate('/submit')} leftIcon={<Upload className="w-4 h-4" />}>
            Submit New
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

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <CardTitle>Needs Your Attention</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {needsAttention.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 rounded-xl bg-white border border-amber-100 hover:border-amber-300 hover:shadow-glass transition-all cursor-pointer"
                    onClick={() => navigate('/submit')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-surface-900 mb-1">{submission.title}</h4>
                        <p className="text-sm text-surface-600 mb-2">
                          {submission.categories.join(', ')}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          <span className="font-medium">
                            {submission.status === 'draft' 
                              ? 'Complete and submit your draft'
                              : 'Address reviewer feedback'}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        {submission.status === 'draft' ? 'Continue' : 'Revise'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* My Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Submissions</CardTitle>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/submissions')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mySubmissions.length > 0 ? (
                mySubmissions.map((submission) => {
                  const statusInfo = getStatusInfo(submission.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={submission.id}
                      className="p-4 rounded-xl border border-surface-100 hover:border-primary-200 hover:shadow-glass transition-all cursor-pointer"
                      onClick={() => navigate('/submissions')}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-surface-900 mb-1 truncate">
                            {submission.title}
                          </h4>
                          <p className="text-sm text-surface-600 mb-2">
                            {submission.categories.join(', ')}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-surface-500">
                            <span>Submitted {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}</span>
                            <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span className="font-medium">{statusInfo.text}</span>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={submission.status} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-surface-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-4">You haven't submitted any abstracts yet</p>
                  <Button onClick={() => navigate('/submit')}>
                    Submit Your First Abstract
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submission Tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">Abstract Format</p>
                    <p className="text-xs text-surface-600 mt-1">
                      Max 300 words, clearly state objectives and methodology
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">Review Timeline</p>
                    <p className="text-xs text-surface-600 mt-1">
                      Reviews typically completed within 4-6 weeks
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">Acceptance Rate</p>
                    <p className="text-xs text-surface-600 mt-1">
                      Current acceptance rate: ~35-40%
                    </p>
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
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm font-medium text-blue-900 mb-1">Submission Deadline</p>
                  <p className="text-xs text-blue-700">March 31, 2024</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-sm font-medium text-purple-900 mb-1">Notification Date</p>
                  <p className="text-xs text-purple-700">May 15, 2024</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Conference Date</p>
                  <p className="text-xs text-emerald-700">July 10-12, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
