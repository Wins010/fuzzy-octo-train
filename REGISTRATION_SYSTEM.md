# Role-Based Authentication & Registration System

## Overview

This document describes the comprehensive role-based authentication system with differentiated user types and registration dashboard implemented for the Confero Conference Management Platform.

## User Roles

### Pre-Created Accounts (Built-in Credentials)

These accounts are automatically seeded when the application starts for the first time:

#### 1. **Admin** - Dr. Sarah Mitchell
- **Email:** admin@confero.io
- **Password:** admin123
- **User ID:** ADM-2025-001
- **Capabilities:** Full system access, schedule management, user management, analytics, system settings

#### 2. **Reviewer** - Dr. James Wilson
- **Email:** reviewer@confero.io
- **Password:** reviewer123
- **User ID:** REV-2025-001
- **Capabilities:** Review submitted papers, access review interface, evaluate submissions

#### 3. **Volunteer** - Emily Chen
- **Email:** volunteer@confero.io
- **Password:** volunteer123
- **User ID:** VOL-2025-001
- **Capabilities:** Task management, volunteer coordination, event assistance

### Self-Registration Accounts

These roles must create their own accounts through the registration page:

#### 4. **Author**
- **Registration:** Self-service at `/register`
- **User ID Format:** AUT-2025-XXX
- **Pricing:** $199 USD
- **Capabilities:** Paper submission, conference presentation, author workshops, networking

#### 5. **Attendee**
- **Registration:** Self-service at `/register`
- **User ID Format:** ATT-2025-XXX
- **Pricing:** $149 USD
- **Capabilities:** Conference access, workshops, networking, all sessions

## Registration Options

### Author Registration - $199 USD

**What's Included:**
- ✅ Paper submission capability
- ✅ Conference presentation slots
- ✅ Access to author workshops
- ✅ Networking sessions
- ✅ Conference materials
- ✅ Certificate of participation

**Best For:** Researchers, academics, and professionals who want to present their work at the conference.

### Attendee Registration - $149 USD

**What's Included:**
- ✅ Full conference access
- ✅ Food and snacks throughout the event
- ✅ Conference merchandise (swag bag, t-shirt, etc.)
- ✅ Workshop participation
- ✅ Panel discussion access
- ✅ Networking sessions
- ✅ Social events and exhibitions
- ✅ Certificate of attendance

**Best For:** Professionals and students who want to attend the conference and learn from presentations.

## Quick Start Guide

### For Pre-seeded Account Users (Admin, Reviewer, Volunteer)

1. Navigate to the login page: `http://localhost:3000/login`
2. Enter your pre-seeded credentials (see above)
3. Click "Sign In"
4. You'll be automatically redirected to your role-specific dashboard

### For New Users (Author, Attendee)

1. Navigate to the registration page: `http://localhost:3000/register`
2. Fill in the registration form:
   - Full Name
   - Email address
   - Select your role (Author or Attendee)
   - Create a secure password (minimum 6 characters)
   - Confirm your password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to your dashboard

### Viewing Registration Options

Navigate to `http://localhost:3000/registration-options` to see a detailed comparison of Author and Attendee registration packages.

## Dashboard Features by Role

### Admin Dashboard
- System statistics and analytics
- User management
- Schedule management (create/edit sessions and events)
- System settings
- Recent submissions overview
- Quick action cards

### Reviewer Dashboard
- Assigned reviews list
- Review statistics (pending, completed, average score)
- Urgent reviews section
- Review guidelines
- Review submission interface

### Volunteer Dashboard
- Task management with priorities
- Task statistics (assigned, completed, pending)
- Upcoming events
- Team resources
- Volunteer coordination tools

### Author Dashboard
- Paper submission interface
- Submission statistics (total, under review, accepted, rejected)
- "Needs Attention" alerts
- Complete submission list with status
- Submission guidelines
- Important conference dates

### Attendee Dashboard (NEW)
- Registration confirmation
- Conference information (dates, venue, attendee count)
- Upcoming sessions schedule
- Networking events
- Registration benefits list
- Important announcements

## Security Features

### Authentication
- Password hashing using bcrypt simulation (base64 encoding for demo)
- Session management with 24-hour expiration
- Automatic logout after session expiry
- Secure token generation

### Authorization
- Role-based access control (RBAC)
- Protected routes requiring authentication
- Role-specific route protection
- Automatic redirect for unauthorized access

### Data Protection
- Input validation on all forms
- XSS protection
- Form validation (required fields, password length, email format)
- Secure session storage

## API Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page (Author/Attendee only)
- `/registration-options` - Registration options comparison page

### Protected Routes (Require Authentication)

#### All Authenticated Users
- `/dashboard` - Redirects to role-specific dashboard
- `/agenda` - Conference agenda view
- `/submissions` - Submissions list
- `/schedule` - Conference schedule
- `/settings` - User settings

#### Admin Only
- `/dashboard/admin` - Admin dashboard
- `/schedule-management` - Schedule management interface
- `/analytics` - Detailed analytics

#### Reviewer Only
- `/dashboard/reviewer` - Reviewer dashboard
- `/reviews` - Paper review interface

#### Volunteer Only
- `/dashboard/volunteer` - Volunteer dashboard

#### Author Only
- `/dashboard/author` - Author dashboard
- `/submit` - Submit abstract

#### Attendee Only
- `/dashboard/attendee` - Attendee dashboard

## User ID Format

Each user receives a unique, permanent ID based on their role:

- **Admin:** `ADM-YYYY-NNN` (e.g., ADM-2025-001)
- **Reviewer:** `REV-YYYY-NNN` (e.g., REV-2025-001)
- **Volunteer:** `VOL-YYYY-NNN` (e.g., VOL-2025-001)
- **Author:** `AUT-YYYY-NNN` (e.g., AUT-2025-001)
- **Attendee:** `ATT-YYYY-NNN` (e.g., ATT-2025-001)

Where:
- `YYYY` = Current year
- `NNN` = Auto-incrementing counter per role (resets yearly)

## Technical Stack

- **Frontend:** React 18.2.0 with TypeScript
- **Routing:** React Router 6.22.0
- **State Management:** Zustand 4.5.0
- **Styling:** Tailwind CSS 3.4.1
- **Animation:** Framer Motion 11.0.5
- **Icons:** Lucide React 0.323.0
- **Notifications:** React Hot Toast 2.4.1
- **Build Tool:** Vite 5.1.0

## Storage

Currently using localStorage for demonstration purposes. In production, this should be replaced with:
- Backend API (Node.js, Python, etc.)
- Database (PostgreSQL, MongoDB, etc.)
- Proper JWT authentication
- Real password hashing (bcrypt, argon2)

## Testing Credentials

### Admin Account
```
Email: admin@confero.io
Password: admin123
```

### Reviewer Account
```
Email: reviewer@confero.io
Password: reviewer123
```

### Volunteer Account
```
Email: volunteer@confero.io
Password: volunteer123
```

### Test Attendee Account
```
Email: john.smith@example.com
Password: password123
User ID: ATT-2025-001
```

## Troubleshooting

### Cannot Login
- Verify you're using the correct email and password
- Check if you're using a pre-seeded account (Admin, Reviewer, Volunteer) or a self-created account
- Ensure your session hasn't expired (24-hour limit)

### Cannot Register
- Verify the email hasn't been used before
- Ensure password is at least 6 characters
- Confirm that password and confirm password fields match
- Only Author and Attendee roles can self-register

### Access Denied
- Verify you're logged in
- Check if your role has permission to access the requested page
- Try logging out and logging back in

### Clear Data
If you need to reset the system:
```javascript
localStorage.clear()
```
Then refresh the page. This will recreate the pre-seeded accounts.

## Production Deployment Checklist

Before deploying to production, ensure:

- [ ] Replace localStorage with proper backend API
- [ ] Implement real password hashing (bcrypt/argon2)
- [ ] Set up proper JWT token authentication
- [ ] Configure database (PostgreSQL/MongoDB)
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Set up proper session management
- [ ] Configure CORS properly
- [ ] Add security headers
- [ ] Implement audit logging
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Add GDPR compliance features
- [ ] Implement proper error handling
- [ ] Set up CI/CD pipeline

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the AUTHENTICATION_README.md file
3. Check the application logs
4. Contact the development team

## License

This is part of the Confero Conference Management Platform.
