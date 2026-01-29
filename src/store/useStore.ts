import { create } from 'zustand';
import { User, AbstractSubmission, ConferenceEvent, Notification, Review } from '@/types';
import { mockUser, mockSubmissions, mockEvents, mockNotifications, mockReviews } from '@/data/mockData';
import { assignPaperIdIfAccepted, syncSubmissions } from '@/services/paperService';
import { removePaperFromAllSessions } from '@/services/scheduleService';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Submissions
  submissions: AbstractSubmission[];
  addSubmission: (submission: AbstractSubmission) => void;
  updateSubmission: (id: string, updates: Partial<AbstractSubmission>) => void;
  deleteSubmission: (id: string) => void;
  
  // Events
  events: ConferenceEvent[];
  addEvent: (event: ConferenceEvent) => void;
  updateEvent: (id: string, updates: Partial<ConferenceEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  // User
  user: mockUser,
  setUser: (user) => set({ user }),
  
  // Submissions
  submissions: mockSubmissions,
  addSubmission: (submission) =>
    set((state) => {
      const processedSubmission = assignPaperIdIfAccepted(submission);
      const newSubmissions = [...state.submissions, processedSubmission];
      syncSubmissions(newSubmissions);
      return { submissions: newSubmissions };
    }),
  updateSubmission: (id, updates) =>
    set((state) => {
      const updatedSubmissions = state.submissions.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          const processed = assignPaperIdIfAccepted(updated);
          
          // If status changed from 'accepted' to something else, remove from sessions
          if (s.status === 'accepted' && updates.status && updates.status !== 'accepted') {
            removePaperFromAllSessions(id);
          }
          
          return processed;
        }
        return s;
      });
      syncSubmissions(updatedSubmissions);
      return { submissions: updatedSubmissions };
    }),
  deleteSubmission: (id) =>
    set((state) => {
      const filteredSubmissions = state.submissions.filter((s) => s.id !== id);
      syncSubmissions(filteredSubmissions);
      return { submissions: filteredSubmissions };
    }),
  
  // Events
  events: mockEvents,
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  
  // Reviews
  reviews: mockReviews,
  addReview: (review) =>
    set((state) => ({ reviews: [...state.reviews, review] })),
  updateReview: (id, updates) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
  
  // Notifications
  notifications: mockNotifications,
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
