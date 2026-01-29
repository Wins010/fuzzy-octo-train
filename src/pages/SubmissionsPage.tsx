import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { AbstractSubmission } from '@/types';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Users,
  Calendar,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge, { StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import AssignReviewersModal from '@/components/modals/AssignReviewersModal';
import EditSubmissionModal from '@/components/modals/EditSubmissionModal';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import { removePaperFromAllSessions } from '@/services/scheduleService';

export default function SubmissionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submissions, updateSubmission, deleteSubmission } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignReviewersModal, setShowAssignReviewersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.authors.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedSub = submissions.find((s) => s.id === selectedSubmission);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleAssignReviewers = (reviewerIds: string[]) => {
    if (!selectedSubmission) return;
    
    // Verify user has Admin role
    if (user?.role !== 'Admin') {
      toast.error('Only administrators can assign reviewers');
      return;
    }

    updateSubmission(selectedSubmission, { reviewers: reviewerIds });
    toast.success('Reviewers assigned successfully');
  };

  const handleEditSubmission = (updates: Partial<AbstractSubmission>) => {
    if (!selectedSubmission) return;

    updateSubmission(selectedSubmission, updates);
    toast.success('Submission updated successfully');
  };

  const handleDeleteSubmission = () => {
    if (!submissionToDelete) return;

    const submission = submissions.find(s => s.id === submissionToDelete);
    
    // Delete the submission
    deleteSubmission(submissionToDelete);
    
    // If submission was accepted and has a paperId, remove from technical sessions
    if (submission?.status === 'accepted' && submission?.paperId) {
      removePaperFromAllSessions(submissionToDelete);
    }

    toast.success('Submission deleted successfully');
    setShowDeleteConfirm(false);
    setSubmissionToDelete(null);
  };

  const openDeleteConfirm = (submissionId: string) => {
    setSubmissionToDelete(submissionId);
    setShowDeleteConfirm(true);
  };

  const openEditModal = (submissionId: string) => {
    setSelectedSubmission(submissionId);
    setShowEditModal(true);
  };

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
            Submissions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mt-1"
          >
            Manage and track all abstract submissions
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/submit')}>
            New Submission
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
                More Filters
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Submissions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Submission
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Authors
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate max-w-xs">
                            {submission.title}
                          </p>
                          <p className="text-xs text-surface-500">
                            {submission.files.length} file(s) attached
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {submission.authors.slice(0, 3).map((author, i) => (
                            <div
                              key={i}
                              className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                              title={author.name}
                            >
                              {author.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        {submission.authors.length > 3 && (
                          <span className="ml-2 text-xs text-surface-500">
                            +{submission.authors.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {submission.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="surface" size="sm">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-surface-500">
                        {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission.id);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(submission.id)}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(submission.id)}
                          className="p-2 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <p className="text-surface-500">No submissions found</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Submission Details"
        size="lg"
      >
        {selectedSub && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">
                {selectedSub.title}
              </h3>
              <StatusBadge status={selectedSub.status} />
            </div>

            <div>
              <h4 className="text-sm font-medium text-surface-700 mb-2">Abstract</h4>
              <p className="text-surface-600 text-sm leading-relaxed">
                {selectedSub.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-surface-700 mb-3">Authors</h4>
              <div className="space-y-3">
                {selectedSub.authors.map((author, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium">
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">
                        {author.name}
                        {author.isCorresponding && (
                          <span className="ml-2 text-xs text-primary-600">(Corresponding)</span>
                        )}
                      </p>
                      <p className="text-xs text-surface-500">{author.affiliation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSub.categories.map((cat) => (
                    <Badge key={cat} variant="primary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSub.keywords.map((kw) => (
                    <Badge key={kw} variant="surface">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-surface-700 mb-3">Attached Files</h4>
              <div className="space-y-2">
                {selectedSub.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-surface-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-surface-900">{file.name}</p>
                        <p className="text-xs text-surface-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-100">
              <div className="flex items-center gap-4 text-sm text-surface-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted {format(selectedSub.submittedAt, 'MMM d, yyyy')}</span>
                </div>
                {selectedSub.reviewers && selectedSub.reviewers.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedSub.reviewers.length} reviewer(s) assigned</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                {user?.role === 'Admin' && (
                  <Button onClick={() => {
                    setShowDetailsModal(false);
                    setShowAssignReviewersModal(true);
                  }}>
                    Assign Reviewers
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Reviewers Modal */}
      {selectedSub && (
        <AssignReviewersModal
          isOpen={showAssignReviewersModal}
          onClose={() => setShowAssignReviewersModal(false)}
          currentReviewers={selectedSub.reviewers || []}
          onAssign={handleAssignReviewers}
        />
      )}

      {/* Edit Submission Modal */}
      {selectedSub && (
        <EditSubmissionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          submission={selectedSub}
          onSave={handleEditSubmission}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Submission"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Are you sure you want to delete this submission? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSubmission}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
