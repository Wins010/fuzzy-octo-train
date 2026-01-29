import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getAllUsers } from '@/services/authService';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Users, Check } from 'lucide-react';

interface AssignReviewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReviewers: string[];
  onAssign: (reviewerIds: string[]) => void;
}

export default function AssignReviewersModal({
  isOpen,
  onClose,
  currentReviewers,
  onAssign,
}: AssignReviewersModalProps) {
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>(currentReviewers);
  const [reviewers, setReviewers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch all users and filter for reviewers
      const users = getAllUsers();
      const reviewerUsers = users.filter(u => u.role === 'Reviewer');
      setReviewers(reviewerUsers);
      setSelectedReviewers(currentReviewers);
    }
  }, [isOpen, currentReviewers]);

  const toggleReviewer = (reviewerId: string) => {
    setSelectedReviewers(prev => {
      if (prev.includes(reviewerId)) {
        return prev.filter(id => id !== reviewerId);
      } else {
        return [...prev, reviewerId];
      }
    });
  };

  const handleAssign = () => {
    onAssign(selectedReviewers);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Reviewers"
      description="Select reviewers to assign to this submission"
      size="md"
    >
      <div className="space-y-4">
        {reviewers.length === 0 ? (
          <div className="text-center py-8 text-surface-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-surface-300" />
            <p>No reviewers available</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reviewers.map(reviewer => {
              const isSelected = selectedReviewers.includes(reviewer.id);
              return (
                <label
                  key={reviewer.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-surface-50 border-2 border-transparent hover:bg-surface-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleReviewer(reviewer.id)}
                    className="sr-only"
                  />
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {reviewer.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {reviewer.fullName}
                      </p>
                      <p className="text-xs text-surface-500 truncate">{reviewer.email}</p>
                      {reviewer.organization && (
                        <p className="text-xs text-surface-400 truncate">{reviewer.organization}</p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleAssign} disabled={selectedReviewers.length === 0}>
          Assign {selectedReviewers.length > 0 ? `(${selectedReviewers.length})` : ''}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
