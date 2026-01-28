# Usage Example: Integrating Role-Specific Dashboards

## Example 1: Simple Route-Based Approach

Add these routes to your `App.tsx`:

```typescript
import { 
  AdminDashboard, 
  VolunteerDashboard, 
  ReviewerDashboard, 
  AuthorDashboard 
} from '@/pages/dashboards';

// In your Routes component:
<Route element={<Layout />}>
  <Route path="/dashboard/admin" element={<AdminDashboard />} />
  <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
  <Route path="/dashboard/reviewer" element={<ReviewerDashboard />} />
  <Route path="/dashboard/author" element={<AuthorDashboard />} />
</Route>
```

## Example 2: Dynamic Role-Based Dashboard (Recommended)

Create a new component `RoleDashboard.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { 
  AdminDashboard, 
  VolunteerDashboard, 
  ReviewerDashboard, 
  AuthorDashboard 
} from '@/pages/dashboards';

export default function RoleDashboard() {
  const { user } = useAuth();

  const dashboardMap = {
    Admin: AdminDashboard,
    Volunteer: VolunteerDashboard,
    Reviewer: ReviewerDashboard,
    Author: AuthorDashboard,
  };

  const DashboardComponent = user?.role ? dashboardMap[user.role] : null;

  if (!DashboardComponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-surface-500">No dashboard available for your role</p>
      </div>
    );
  }

  return <DashboardComponent />;
}
```

Then update your `App.tsx`:

```typescript
import RoleDashboard from '@/pages/RoleDashboard';

// In your Routes:
<Route element={<Layout />}>
  <Route path="/dashboard" element={<RoleDashboard />} />
  {/* Other routes */}
</Route>
```

## Example 3: Protected Route with Role Check

Create `ProtectedRoleDashboard.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  AdminDashboard, 
  VolunteerDashboard, 
  ReviewerDashboard, 
  AuthorDashboard 
} from '@/pages/dashboards';

export default function ProtectedRoleDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const dashboardMap = {
    Admin: AdminDashboard,
    Volunteer: VolunteerDashboard,
    Reviewer: ReviewerDashboard,
    Author: AuthorDashboard,
  };

  const DashboardComponent = user?.role ? dashboardMap[user.role] : null;

  if (!DashboardComponent) {
    return <Navigate to="/" replace />;
  }

  return <DashboardComponent />;
}
```

## Example 4: Redirect After Login

Update your `LoginPage.tsx` after successful login:

```typescript
// After successful login
await login(formData);

// Redirect based on role
const roleRoutes = {
  Admin: '/dashboard/admin',
  Volunteer: '/dashboard/volunteer',
  Reviewer: '/dashboard/reviewer',
  Author: '/dashboard/author',
};

const redirectRoute = user?.role ? roleRoutes[user.role] : '/dashboard';
navigate(redirectRoute, { replace: true });
```

## Example 5: Testing Each Dashboard

```typescript
// Test with mock user data
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';

test('renders admin dashboard with user info', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <AdminDashboard />
      </AuthProvider>
    </BrowserRouter>
  );

  // Check for welcome message
  expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  
  // Check for user ID display
  expect(screen.getByText(/User ID:/i)).toBeInTheDocument();
});
```

## Quick Integration Steps

1. **Import the dashboards** in your routing file
2. **Add routes** for each dashboard or create a dynamic role-based route
3. **Update login logic** to redirect users to their role-specific dashboard
4. **Add navigation links** in your Layout/Header component
5. **Test** with users of each role

## Dashboard Features Summary

| Dashboard | Key Features | Primary Actions |
|-----------|--------------|-----------------|
| **Admin** | System stats, quick actions, system status | Schedule Management, Analytics, Settings |
| **Volunteer** | Task management, event coordination | Start Task, Complete Task, View Schedule |
| **Reviewer** | Review tracking, urgent reviews | Start Review, Review History |
| **Author** | Submission tracking, status updates | Submit New, View Submissions |

## Additional Customization

Each dashboard can be customized by:
- Modifying the stats array for different metrics
- Adding/removing quick action cards
- Adjusting color schemes and gradients
- Customizing animation timings
- Adding role-specific features

For detailed documentation, see the [README.md](./README.md) file.
