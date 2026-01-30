# User Authentication System & Conference Management Features

This document describes the complete user authentication system with role-based access control and conference schedule management features that have been implemented.

## Features Implemented

### 1. User Authentication System

#### Registration
- **Location**: `/register` (RegisterPage.tsx)
- **Features**:
  - Full name, email, password, and password confirmation fields
  - Role selection: Admin, Volunteer, Reviewer, Author
  - Unique user ID generation with role-specific prefixes
  - Form validation (required fields, password length, password match)
  - Auto-login after successful registration
  - Redirect to role-specific dashboard

#### Login
- **Location**: `/login` (LoginPage.tsx)
- **Features**:
  - Email and password authentication
  - Session management using JWT-like tokens
  - 24-hour session expiration
  - Redirect to role-specific dashboard based on user role
  - Demo credentials provided

#### Demo Credentials
```
Email: admin@confero.io
Password: admin123
Role: Admin
```

### 2. Unique User ID Generation

Each registered user receives a permanent unique ID with role-specific prefixes:
- **Admin**: `ADM-YYYY-NNN` (e.g., `ADM-2025-001`)
- **Volunteer**: `VOL-YYYY-NNN` (e.g., `VOL-2025-001`)
- **Reviewer**: `REV-YYYY-NNN` (e.g., `REV-2025-001`)
- **Author**: `AUT-YYYY-NNN` (e.g., `AUT-2025-001`)

The counter auto-increments per role and resets yearly.

### 3. Role-Based Dashboards

After login, users are redirected to role-specific dashboards:

#### Admin Dashboard (`/dashboard/admin`)
- Welcome message with name and unique ID
- Statistics: Submissions, Pending Reviews, Accepted, Events
- Quick access to:
  - Schedule Management
  - User Management
  - System Settings
  - Analytics
- Recent submissions list
- System status panel

#### Volunteer Dashboard (`/dashboard/volunteer`)
- Welcome message with name and unique ID
- Task management with priorities
- Task statistics (assigned, completed, pending)
- Upcoming events
- Team resources

#### Reviewer Dashboard (`/dashboard/reviewer`)
- Welcome message with name and unique ID
- Review statistics (assigned, pending, completed, average score)
- Urgent reviews section
- Assigned reviews list
- Review progress tracking
- Review guidelines

#### Author Dashboard (`/dashboard/author`)
- Welcome message with name and unique ID
- Submission statistics (total, under review, accepted, rejected)
- "Needs Attention" alerts
- Complete submission list with status
- Submission guidelines
- Important dates

### 4. Schedule Management (Admin Only)

**Location**: `/schedule-management` (ScheduleManagementPage.tsx)

#### Global Events Management
- Create, edit, and delete global events
- Fields: Event Title, Time, Location
- Event Type: "Global Event" (fixed)
- Chronological listing

#### Technical Sessions Management
- Create, edit, and delete technical sessions
- Fields: Session Title, Time Slot, Room Location, Session Chairs
- Add/edit/delete papers within sessions
- Paper fields: Paper ID, Paper Title, Authors
- Reorder papers within sessions
- Collapsible UI for space management

#### CSV Import Feature
- Bulk upload papers from CSV file
- CSV format: `Session ID, Paper ID, Paper Title, Authors`
- Validation:
  - Verify session existence
  - Check for duplicate Paper IDs
  - Validate required fields
  - Proper CSV format
- Preview imported data
- Detailed error reporting with line numbers
- Download CSV template
- Success/failure result display

**CSV Template Example**:
```csv
Session ID,Paper ID,Paper Title,Authors
ts-1234567890,P001,Machine Learning Advances,"John Doe, Jane Smith"
ts-1234567890,P002,Deep Learning Applications,"Alice Brown"
```

### 5. Conference Agenda View (All Users)

**Location**: `/agenda` (ConferenceAgendaPage.tsx)

#### Features
- Display both Global Events and Technical Sessions
- Show papers within technical sessions (ID, title, authors)
- Responsive multi-column layout
- Search functionality:
  - Session title
  - Paper title
  - Author name
  - Paper ID
  - Time/date
- Sort options:
  - By time (chronological)
  - By session title (alphabetical)
  - By room/location
- Professional styling with clear visual hierarchy
- Print-friendly view
- Read-only for non-Admin users
- "Edit Schedule" button visible only to Admins

### 6. Security & Access Control

#### Authentication
- All routes (except `/login` and `/register`) require authentication
- Unauthenticated users redirected to login page
- Session validation on every page load
- 24-hour session expiration

#### Authorization
- Role-based access control (RBAC)
- Protected routes for Admin-only features:
  - `/schedule-management` - Only accessible by Admin
  - Role-specific dashboards enforce role matching
- 403 Forbidden for unauthorized access
- UI elements hidden based on user role

#### Frontend Security
- Route guards using ProtectedRoute component
- Role-based UI rendering
- Input validation on forms
- Error handling with user-friendly messages

#### Backend Simulation (LocalStorage)
- Password hashing simulation (base64 encoding)
- Session token generation
- Data persistence in localStorage
- In production, replace with proper backend API

### 7. Data Storage

Currently using localStorage for data persistence (simulating a backend):

#### Storage Keys
- `users` - All registered users
- `authSession` - Current user session
- `counter_{Role}_{Year}` - User ID counters per role/year
- `globalEvents` - All global events
- `technicalSessions` - All technical sessions with papers

#### Services
- **authService.ts** - User registration, login, logout, session management
- **scheduleService.ts** - CRUD operations for events, sessions, and papers

## Usage

### Starting the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First-Time Setup

1. Navigate to `http://localhost:3000`
2. Click "Sign up" or go to `/register`
3. Fill in the registration form:
   - Enter your full name
   - Provide an email
   - Create a password (min 6 characters)
   - Confirm password
   - Select a role (Admin, Volunteer, Reviewer, or Author)
4. Click "Create Account"
5. You'll be auto-logged in and redirected to your role-specific dashboard

### Using the Schedule Management (Admin Only)

1. Login as Admin
2. Navigate to Schedule Management from the dashboard
3. Use tabs to switch between:
   - Global Events - Create keynotes, breaks, networking events
   - Technical Sessions - Create sessions and add papers
4. To import papers via CSV:
   - Click "Import CSV" in Technical Sessions tab
   - Download the template or prepare your CSV
   - Upload the file
   - Review any validation errors
   - Confirm import

### Viewing the Conference Agenda

1. Login with any role
2. Navigate to `/agenda` from the navigation menu
3. Use the search bar to filter agenda items
4. Use sort dropdown to change order
5. Click "Print Agenda" for a print-friendly view
6. Admin users see an "Edit Schedule" button

## Technical Stack

- **React** 18.2.0 - UI framework
- **TypeScript** - Type safety
- **React Router** 6.22.0 - Routing
- **Zustand** 4.5.0 - State management
- **Framer Motion** 11.0.5 - Animations
- **Tailwind CSS** 3.4.1 - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Vite** 5.1.0 - Build tool

## File Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx         # Route guard component
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── layout/
│       ├── Layout.tsx
│       └── Header.tsx
├── contexts/
│   └── AuthContext.tsx            # Authentication context
├── services/
│   ├── authService.ts             # User auth logic
│   └── scheduleService.ts         # Schedule CRUD operations
├── pages/
│   ├── LoginPage.tsx              # Login page
│   ├── RegisterPage.tsx           # Registration page
│   ├── ConferenceAgendaPage.tsx   # Public agenda view
│   ├── dashboards/                # Role-specific dashboards
│   │   ├── AdminDashboard.tsx
│   │   ├── VolunteerDashboard.tsx
│   │   ├── ReviewerDashboard.tsx
│   │   └── AuthorDashboard.tsx
│   └── schedule-management/       # Admin schedule management
│       ├── ScheduleManagementPage.tsx
│       ├── GlobalEventsTab.tsx
│       ├── TechnicalSessionsTab.tsx
│       └── CSVImportModal.tsx
├── types/
│   └── index.ts                   # TypeScript interfaces
├── App.tsx                        # Main routing
└── main.tsx                       # App entry point
```

## API Reference

### Authentication Service

```typescript
// Register a new user
registerUser(formData: RegisterFormData): Promise<User>

// Login user
loginUser(formData: LoginFormData): Promise<AuthSession>

// Logout user
logoutUser(): void

// Get current session
getCurrentSession(): AuthSession | null

// Check user role
hasRole(user: User | null, allowedRoles: UserRole[]): boolean

// Generate unique user ID
generateUniqueUserId(role: UserRole): string
```

### Schedule Service

```typescript
// Global Events
getAllGlobalEvents(): GlobalEvent[]
saveGlobalEvent(event: Omit<GlobalEvent, 'id' | 'createdAt' | 'updatedAt'>): GlobalEvent
updateGlobalEvent(id: string, updates: Partial<GlobalEvent>): GlobalEvent | null
deleteGlobalEvent(id: string): boolean

// Technical Sessions
getAllTechnicalSessions(): TechnicalSession[]
saveTechnicalSession(session: Omit<TechnicalSession, ...>): TechnicalSession
updateTechnicalSession(id: string, updates: Partial<TechnicalSession>): TechnicalSession | null
deleteTechnicalSession(id: string): boolean

// Papers
addPaperToSession(sessionId: string, paperData: Omit<Paper, ...>): Paper | null
updatePaper(paperId: string, updates: Partial<Paper>): Paper | null
deletePaper(paperId: string): boolean
reorderPapers(sessionId: string, paperIds: string[]): boolean

// CSV Import
importPapersFromCSV(csvData: string): CSVImportResult
```

## Future Enhancements

### Short Term
1. Add email verification for registration
2. Implement password reset functionality
3. Add user profile editing
4. Export agenda to PDF
5. Add calendar integration (iCal export)

### Medium Term
1. Real backend API integration
2. Proper password hashing (bcrypt)
3. JWT token authentication
4. Database persistence (PostgreSQL/MongoDB)
5. File upload for paper PDFs
6. Email notifications

### Long Term
1. Multi-conference support
2. Advanced analytics dashboard
3. Real-time collaboration features
4. Mobile app (React Native)
5. Integration with academic databases
6. Automated scheduling assistant

## Troubleshooting

### Issue: "Access Denied" when accessing admin features
**Solution**: Make sure you're logged in with an Admin role account. The demo admin credentials are provided in the login page.

### Issue: CSV import fails
**Solution**: 
- Ensure the CSV format matches the template
- Check that Session IDs exist (create sessions first)
- Verify Paper IDs are unique
- Make sure all required fields are present

### Issue: Session expires unexpectedly
**Solution**: Sessions expire after 24 hours. Login again to create a new session.

### Issue: User ID counter not incrementing
**Solution**: Check browser localStorage. Clear it if needed: `localStorage.clear()`

## Security Considerations

⚠️ **Important**: This implementation uses localStorage and client-side authentication which is suitable for demos but NOT for production use.

For production deployment:
1. Implement a secure backend API
2. Use proper password hashing (bcrypt, argon2)
3. Implement JWT tokens with refresh tokens
4. Add CSRF protection
5. Use HTTPS for all communications
6. Implement rate limiting
7. Add SQL injection prevention (if using SQL database)
8. Sanitize all user inputs
9. Implement proper session management
10. Add security headers

## License

This project is part of the Confero Conference Management Platform.

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.
