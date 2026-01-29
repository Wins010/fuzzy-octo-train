import { AbstractSubmission } from '@/types';

/**
 * Generate a unique Paper ID for an accepted submission
 * Format: CONF2026-XXX where XXX is a zero-padded sequential number
 */
export const generatePaperId = (): string => {
  const submissionsStr = localStorage.getItem('submissions');
  const submissions: AbstractSubmission[] = submissionsStr ? JSON.parse(submissionsStr) : [];
  
  // Find all existing paper IDs
  const existingPaperIds = submissions
    .filter(s => s.paperId)
    .map(s => s.paperId!);
  
  // Extract the numeric part and find the max
  let maxNumber = 0;
  existingPaperIds.forEach(paperId => {
    const match = paperId.match(/CONF2026-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  // Generate next ID
  const nextNumber = maxNumber + 1;
  return `CONF2026-${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Get all submissions with 'accepted' status
 */
export const getAcceptedPapers = (): AbstractSubmission[] => {
  const submissionsStr = localStorage.getItem('submissions');
  const submissions: AbstractSubmission[] = submissionsStr ? JSON.parse(submissionsStr) : [];
  
  return submissions.filter(s => s.status === 'accepted');
};

/**
 * Auto-assign paper ID when submission status changes to 'accepted'
 */
export const assignPaperIdIfAccepted = (submission: AbstractSubmission): AbstractSubmission => {
  if (submission.status === 'accepted' && !submission.paperId) {
    return {
      ...submission,
      paperId: generatePaperId(),
    };
  }
  return submission;
};

/**
 * Update submissions in localStorage and sync paper IDs
 */
export const syncSubmissions = (submissions: AbstractSubmission[]): void => {
  localStorage.setItem('submissions', JSON.stringify(submissions));
};

/**
 * Get a submission by its paper ID
 */
export const getSubmissionByPaperId = (paperId: string): AbstractSubmission | null => {
  const submissionsStr = localStorage.getItem('submissions');
  const submissions: AbstractSubmission[] = submissionsStr ? JSON.parse(submissionsStr) : [];
  
  return submissions.find(s => s.paperId === paperId) || null;
};

/**
 * Format paper display for selector: [Paper ID] Title - Author(s)
 */
export const formatPaperDisplay = (submission: AbstractSubmission): string => {
  const authorNames = submission.authors.map(a => a.name).join(', ');
  return `[${submission.paperId}] ${submission.title} - ${authorNames}`;
};
