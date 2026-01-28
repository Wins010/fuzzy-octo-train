# Role-Specific Dashboards

This directory contains role-specific dashboard components for the conference management system. Each dashboard is tailored to the specific needs and responsibilities of different user roles.

## Dashboard Components

### 1. AdminDashboard.tsx
**Purpose:** Administrative overview and system management

**Features:**
- Welcome message with user name and unique ID
- System statistics (submissions, pending reviews, accepted papers, events)
- Quick actions for:
  - Schedule Management
  - User Management
  - System Settings
  - Analytics
- Recent submissions overview
- System status monitoring (active users, scheduled events, system health)

**Access:** Users with role `Admin`

**Navigation:** 
- Schedule Management → `/schedule`
- Analytics → `/analytics`
- Settings → `/settings`

---

### 2. VolunteerDashboard.tsx
**Purpose:** Task management and event coordination for volunteers

**Features:**
- Welcome message with user name and unique ID
- Task statistics (total assigned, completed, pending)
- My Tasks section with:
  - Task titles and descriptions
  - Priority levels (high, medium, low)
  - Status tracking (pending, in_progress, completed)
  - Due dates and locations
  - Quick action buttons
- Upcoming events with type badges
- Quick links (Team Directory, Venue Map, Report Issue)

**Access:** Users with role `Volunteer`

**Navigation:**
- Schedule → `/schedule`

---

### 3. ReviewerDashboard.tsx
**Purpose:** Paper review management and tracking

**Features:**
- Welcome message with user name and unique ID
- Review statistics (assigned, pending, completed, avg score)
- Urgent reviews section highlighting approaching deadlines
- Assigned reviews list with completion status
- Review progress tracking with completion rate
- Review guidelines panel with:
  - Evaluation criteria
  - Review timeline
  - Confidentiality reminders

**Access:** Users with role `Reviewer`

**Navigation:**
- Review History → `/reviews`
- Start Review → `/reviews`

---

### 4. AuthorDashboard.tsx
**Purpose:** Submission tracking and management for authors

**Features:**
- Welcome message with user name and unique ID
- Submission statistics (total, under review, accepted, rejected)
- "Needs Attention" section for:
  - Draft submissions
  - Revision requests
- Complete submission list with:
  - Status indicators
  - Submission dates
  - Status-specific messages
- Submission guidelines
- Important dates calendar

**Access:** Users with role `Author`

**Navigation:**
- View All Submissions → `/submissions`
- Submit New → `/submit`

---

## Usage

### Importing Dashboards

```typescript
// Import individual dashboards
import { AdminDashboard } from '@/pages/dashboards';
import { VolunteerDashboard } from '@/pages/dashboards';
import { ReviewerDashboard } from '@/pages/dashboards';
import { AuthorDashboard } from '@/pages/dashboards';

// Or import specific dashboard
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
```

### Route Configuration Example

```typescript
import { 
  AdminDashboard, 
  VolunteerDashboard, 
  ReviewerDashboard, 
  AuthorDashboard 
} from '@/pages/dashboards';

// In your routing configuration
<Route path="/dashboard/admin" element={<AdminDashboard />} />
<Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
<Route path="/dashboard/reviewer" element={<ReviewerDashboard />} />
<Route path="/dashboard/author" element={<AuthorDashboard />} />
```

### Role-Based Dashboard Selection

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { 
  AdminDashboard, 
  VolunteerDashboard, 
  ReviewerDashboard, 
  AuthorDashboard 
} from '@/pages/dashboards';

function RoleDashboard() {
  const { user } = useAuth();

  const dashboardMap = {
    Admin: AdminDashboard,
    Volunteer: VolunteerDashboard,
    Reviewer: ReviewerDashboard,
    Author: AuthorDashboard,
  };

  const DashboardComponent = user?.role ? dashboardMap[user.role] : null;

  if (!DashboardComponent) {
    return <div>No dashboard available for your role</div>;
  }

  return <DashboardComponent />;
}
```

---

## Common Features

All dashboards share these common elements:

### Welcome Section
- Displays user's first name
- Shows unique user ID (e.g., `ADM-2026-001`)
- Indicates user role
- Provides role-specific action buttons

### Statistics Cards
- Gradient icon backgrounds
- Color-coded by category
- Animated entrance effects
- Hover effects for interactivity

### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly interactions

### Animations
- Framer Motion animations
- Staggered entrance effects
- Smooth transitions

---

## Dependencies

All dashboards use the following shared dependencies:

### UI Components
- `@/components/ui/Card` - Card container with header and content
- `@/components/ui/Button` - Styled button component
- `@/components/ui/Badge` - Status badges

### Context & State
- `@/contexts/AuthContext` - Authentication and user data
- `@/store/useStore` - Global state management

### Icons
- `lucide-react` - Icon library

### Utilities
- `framer-motion` - Animations
- `date-fns` - Date formatting
- `react-router-dom` - Navigation

---

## Customization

### Color Schemes
Each dashboard uses consistent color gradients:
- **Blue/Cyan** - General information
- **Amber/Orange** - Warnings/Pending items
- **Emerald/Teal** - Success/Completed items
- **Purple/Pink** - Special features
- **Red/Rose** - Errors/Rejected items

### Animation Timing
Adjust animation delays in the `transition` prop:
```typescript
transition={{ delay: 0.1 }} // Faster
transition={{ delay: 0.5 }} // Slower
```

### Statistics
Modify the `stats` array in each dashboard to add/remove statistics cards.

---

## User Data Structure

Each dashboard expects user data from `useAuth()`:
```typescript
{
  id: string;
  uniqueUserId: string;  // e.g., "ADM-2026-001"
  email: string;
  fullName: string;
  name: string;          // Display name
  role: UserRole;        // 'Admin' | 'Volunteer' | 'Reviewer' | 'Author'
  organization?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Development Notes

### Adding New Features
1. Import required components and hooks
2. Add feature to the appropriate section
3. Follow existing animation patterns
4. Maintain responsive design
5. Test on mobile and desktop

### Performance
- Components use React hooks efficiently
- Data filtering is memoization-friendly
- Animations are GPU-accelerated via Framer Motion

### Testing
Test each dashboard with users of the appropriate role to ensure:
- Correct data filtering
- Proper permission checks
- Navigation works correctly
- Responsive design on all devices

---

## Support

For issues or questions about these dashboards, please refer to:
- Project documentation
- Component storybook (if available)
- Team wiki or Confluence pages
