import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  Search,
  Filter,
  Star,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import Badge, { StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { format } from 'date-fns';

export default function ReviewsPage() {
  const { submissions, reviews, addReview } = useStore();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Review form state
  const [reviewScore, setReviewScore] = useState(7);
  const [reviewDecision, setReviewDecision] = useState<'accept' | 'reject' | 'revision'>('accept');
  const [reviewComments, setReviewComments] = useState('');
  const [criteria, setCriteria] = useState([
    { name: 'Originality', score: 7, maxScore: 10 },
    { name: 'Technical Quality', score: 7, maxScore: 10 },
    { name: 'Clarity', score: 7, maxScore: 10 },
    { name: 'Significance', score: 7, maxScore: 10 },
  ]);

  const assignedSubmissions = submissions.filter(
    (s) => s.status === 'under_review' || s.status === 'pending'
  );

  const filteredSubmissions = assignedSubmissions.filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedSub = submissions.find((s) => s.id === selectedSubmission);
  const submissionReviews = reviews.filter((r) => r.submissionId === selectedSubmission);

  const updateCriteriaScore = (index: number, score: number) => {
    const newCriteria = [...criteria];
    newCriteria[index].score = score;
    setCriteria(newCriteria);
    // Update overall score
    const avg = newCriteria.reduce((sum, c) => sum + c.score, 0) / newCriteria.length;
    setReviewScore(Math.round(avg));
  };

  const handleSubmitReview = () => {
    if (!selectedSubmission) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      submissionId: selectedSubmission,
      reviewerId: 'user-1',
      reviewerName: 'Dr. Sarah Mitchell',
      score: reviewScore,
      decision: reviewDecision,
      comments: reviewComments,
      criteria,
      submittedAt: new Date(),
    };

    addReview(newReview);
    setShowReviewModal(false);
    setReviewComments('');
    setCriteria([
      { name: 'Originality', score: 7, maxScore: 10 },
      { name: 'Technical Quality', score: 7, maxScore: 10 },
      { name: 'Clarity', score: 7, maxScore: 10 },
      { name: 'Significance', score: 7, maxScore: 10 },
    ]);
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'accept':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'reject':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'revision':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-surface-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-surface-900"
        >
          Peer Reviews
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-surface-500 mt-1"
        >
          Review assigned submissions and provide feedback
        </motion.p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Assigned to You', value: assignedSubmissions.length, icon: FileText, color: 'blue' },
          { label: 'Reviews Completed', value: reviews.length, icon: CheckCircle, color: 'emerald' },
          { label: 'Pending Reviews', value: assignedSubmissions.length - reviews.length, icon: Clock, color: 'amber' },
          { label: 'Average Score', value: '8.2', icon: Star, color: 'purple' },
        ].map((stat, i) => (
          <Card key={i}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                <p className="text-sm text-surface-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Submissions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {filteredSubmissions.map((submission, index) => {
          const subReviews = reviews.filter((r) => r.submissionId === submission.id);
          const hasReviewed = subReviews.some((r) => r.reviewerId === 'user-1');

          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover onClick={() => {
                setSelectedSubmission(submission.id);
                setShowReviewModal(true);
              }}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900 line-clamp-2">
                        {submission.title}
                      </h3>
                      <p className="text-sm text-surface-500 mt-1">
                        {submission.authors.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>

                  <p className="text-sm text-surface-600 line-clamp-3">
                    {submission.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {submission.categories.map((cat) => (
                      <Badge key={cat} variant="surface" size="sm">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-2 text-sm text-surface-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>{subReviews.length} review(s)</span>
                    </div>
                    {hasReviewed ? (
                      <Badge variant="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reviewed
                      </Badge>
                    ) : (
                      <Button size="sm">Submit Review</Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Submit Review"
        size="xl"
      >
        {selectedSub && (
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="p-4 bg-surface-50 rounded-xl">
              <h3 className="font-semibold text-surface-900 mb-2">{selectedSub.title}</h3>
              <p className="text-sm text-surface-600 line-clamp-3">{selectedSub.description}</p>
            </div>

            {/* Previous Reviews */}
            {submissionReviews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-3">Previous Reviews</h4>
                <div className="space-y-3">
                  {submissionReviews.map((review) => (
                    <div key={review.id} className="p-3 bg-surface-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-surface-400" />
                          <span className="text-sm font-medium text-surface-700">
                            {review.reviewerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDecisionIcon(review.decision)}
                          <span className="text-sm font-medium">{review.score}/10</span>
                        </div>
                      </div>
                      <p className="text-sm text-surface-600">{review.comments}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scoring Criteria */}
            <div>
              <h4 className="text-sm font-medium text-surface-700 mb-3">Evaluation Criteria</h4>
              <div className="space-y-4">
                {criteria.map((c, index) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-600">{c.name}</span>
                      <span className="text-sm font-semibold text-surface-900">
                        {c.score}/{c.maxScore}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={c.maxScore}
                      value={c.score}
                      onChange={(e) => updateCriteriaScore(index, parseInt(e.target.value))}
                      className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Score & Decision */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Overall Score
                </label>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-bold text-primary-600">{reviewScore}</div>
                  <div className="text-surface-500">/10</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Recommendation
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'accept', label: 'Accept', color: 'emerald' },
                    { value: 'revision', label: 'Revision', color: 'amber' },
                    { value: 'reject', label: 'Reject', color: 'red' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setReviewDecision(opt.value as typeof reviewDecision)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        reviewDecision === opt.value
                          ? `bg-${opt.color}-100 text-${opt.color}-700 ring-2 ring-${opt.color}-500`
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments */}
            <Textarea
              label="Review Comments *"
              placeholder="Provide detailed feedback for the authors..."
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              rows={6}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={!reviewComments.trim()}
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
