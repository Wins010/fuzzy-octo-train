// User & Auth Types
export type UserRole = 'admin' | 'reviewer' | 'submitter' | 'attendee';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organization?: string;
  bio?: string;
  createdAt: Date;
}

// Abstract Submission Types
export type SubmissionStatus = 'draft' | 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_requested';

export interface AbstractSubmission {
  id: string;
  title: string;
  description: string;
  authors: Author[];
  categories: string[];
  keywords: string[];
  files: SubmissionFile[];
  status: SubmissionStatus;
  submittedBy: string;
  submittedAt: Date;
  updatedAt: Date;
  reviewers?: string[];
  reviews?: Review[];
}

export interface Author {
  name: string;
  email: string;
  affiliation: string;
  isCorresponding: boolean;
}

export interface SubmissionFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Review Types
export type ReviewDecision = 'accept' | 'reject' | 'revision' | 'pending';

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  score: number;
  decision: ReviewDecision;
  comments: string;
  privateNotes?: string;
  criteria: ReviewCriteria[];
  submittedAt: Date;
}

export interface ReviewCriteria {
  name: string;
  score: number;
  maxScore: number;
  comment?: string;
}

// Schedule Types
export type SessionType = 'keynote' | 'presentation' | 'workshop' | 'panel' | 'break' | 'networking' | 'poster';

export interface ConferenceEvent {
  id: string;
  title: string;
  description: string;
  type: SessionType;
  speakers: Speaker[];
  startTime: Date;
  endTime: Date;
  location: string;
  room?: string;
  track?: string;
  capacity?: number;
  registeredCount: number;
  tags: string[];
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar?: string;
  bio?: string;
}

export interface Schedule {
  id: string;
  conferenceId: string;
  name: string;
  days: ScheduleDay[];
}

export interface ScheduleDay {
  date: Date;
  events: ConferenceEvent[];
}

// Registration Types
export interface Registration {
  id: string;
  userId: string;
  conferenceId: string;
  ticketType: string;
  sessions: string[];
  workshops: string[];
  dietaryRequirements?: string;
  specialNeeds?: string;
  registeredAt: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Notification Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'deadline' | 'update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

// Analytics Types
export interface AnalyticsData {
  totalSubmissions: number;
  pendingReviews: number;
  acceptedAbstracts: number;
  rejectedAbstracts: number;
  totalRegistrations: number;
  reviewerActivity: ReviewerActivity[];
  submissionTrends: TrendData[];
  categoryDistribution: CategoryData[];
}

export interface ReviewerActivity {
  reviewerId: string;
  reviewerName: string;
  assigned: number;
  completed: number;
  avgScore: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

// Conference Settings
export interface ConferenceSettings {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  primaryColor: string;
  accentColor: string;
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  reviewDeadline: Date;
  earlyBirdDeadline?: Date;
  venue: Venue;
  categories: string[];
  ticketTypes: TicketType[];
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  benefits: string[];
  available: number;
  sold: number;
}
