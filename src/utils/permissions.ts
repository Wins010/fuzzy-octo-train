import { UserRole } from '@/types';

export const canViewReviews = (role: UserRole): boolean => {
  return role === 'Reviewer' || role === 'Admin';
};

export const canEditReviews = (role: UserRole): boolean => {
  return role === 'Reviewer' || role === 'Admin';
};

export const canViewSchedule = (role: UserRole): boolean => {
  // All roles can view schedule
  return true;
};

export const canEditSchedule = (role: UserRole): boolean => {
  return role === 'Admin';
};

export const canManageSessions = (role: UserRole): boolean => {
  return role === 'Admin';
};

export const canViewReviewScores = (role: UserRole): boolean => {
  return role === 'Reviewer' || role === 'Admin';
};

export const canViewReviewComments = (role: UserRole): boolean => {
  return role === 'Reviewer' || role === 'Admin';
};
