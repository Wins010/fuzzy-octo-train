// User & Auth Types
export type UserRole = 'Admin' | 'Volunteer' | 'Reviewer' | 'Author' | 'Attendee';

export interface User {
  id: string;
  uniqueUserId: string; // e.g., ADM-2026-001
  email: string;
  fullName: string;
  name: string; // For backwards compatibility
  passwordHash: string;
  avatar?: string;
  role: UserRole;
  organization?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Abstract Submission Types
export type SubmissionStatus = 'draft' | 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_requested';

export interface AbstractSubmission {
  id: string;
  paperId?: string; // Auto-generated when status changes to 'accepted' (e.g., CONF2026-001)
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

// Schedule Management Types (for Admin)
export interface GlobalEvent {
  id: string;
  title: string;
  description?: string; // Optional description
  time: string; // Legacy: time string format
  startDateTime?: Date; // NEW: structured date/time
  endDateTime?: Date; // NEW: structured date/time
  location: string;
  eventType: 'Global Event' | 'keynote' | 'workshop' | 'networking' | 'break' | 'registration' | 'ceremony' | 'other';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicalSession {
  id: string;
  sessionTitle: string;
  timeSlot: string;
  roomLocation: string;
  sessionChairs: string;
  sessionTheme?: string; // Track/theme for the session
  papers: Paper[]; // Legacy: manually entered papers via CSV
  assignedPaperIds: string[]; // NEW: IDs of AbstractSubmission papers assigned to this session
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Paper {
  id: string;
  sessionId: string;
  paperId: string;
  paperTitle: string;
  authors: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// CSV Import Types
export interface CSVImportRow {
  sessionId: string;
  paperId: string;
  paperTitle: string;
  authors: string;
}

export interface CSVImportResult {
  success: boolean;
  importedCount: number;
  errors: CSVImportError[];
}

export interface CSVImportError {
  line: number;
  error: string;
  row?: CSVImportRow;
}

// Unified Schedule Item Types (NEW - for enhanced schedule management)
export type ScheduleItemType = 'event' | 'technical_session';
export type EventType = 'keynote' | 'workshop' | 'networking' | 'break' | 'registration' | 'ceremony' | 'other';

export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  // For general events
  eventType?: EventType;
  // For technical sessions
  sessionTheme?: string;
  sessionChair?: string;
  assignedPaperIds?: string[]; // References to AbstractSubmission IDs with status='accepted'
  // Metadata
  createdBy: string; // User ID of admin who created it
  createdAt: Date;
  updatedAt: Date;
}
