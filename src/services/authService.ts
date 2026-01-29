import { User, UserRole, AuthSession, RegisterFormData, LoginFormData } from '@/types';

// Simple hash function (in production, use proper bcrypt)
const hashPassword = async (password: string): Promise<string> => {
  // Simple simulation of password hashing
  return btoa(password + 'salt_confero_2026');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const computed = await hashPassword(password);
  return computed === hash;
};

// Generate unique user ID with role prefix
export const generateUniqueUserId = (role: UserRole): string => {
  const year = new Date().getFullYear();
  const prefix = {
    'Admin': 'ADM',
    'Volunteer': 'VOL',
    'Reviewer': 'REV',
    'Author': 'AUT',
    'Attendee': 'ATT',
  }[role];

  // Get counter from localStorage
  const counterKey = `counter_${role}_${year}`;
  const counter = parseInt(localStorage.getItem(counterKey) || '0', 10) + 1;
  localStorage.setItem(counterKey, counter.toString());

  // Format: PREFIX-YEAR-COUNTER (e.g., AUT-2026-001)
  const paddedCounter = counter.toString().padStart(3, '0');
  return `${prefix}-${year}-${paddedCounter}`;
};

// Register new user
export const registerUser = async (formData: RegisterFormData): Promise<User> => {
  const users = getAllUsers();

  // Check if email already exists
  if (users.find(u => u.email === formData.email)) {
    throw new Error('Email already registered');
  }

  // Validate password match
  if (formData.password !== formData.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // Create new user
  const uniqueUserId = generateUniqueUserId(formData.role);
  const passwordHash = await hashPassword(formData.password);

  const newUser: User = {
    id: `user-${Date.now()}`,
    uniqueUserId,
    email: formData.email,
    fullName: formData.fullName,
    name: formData.fullName, // For backwards compatibility
    passwordHash,
    role: formData.role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Save user
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  return newUser;
};

// Login user
export const loginUser = async (formData: LoginFormData): Promise<AuthSession> => {
  const users = getAllUsers();
  const user = users.find(u => u.email === formData.email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await verifyPassword(formData.password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Create session
  const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

  const session: AuthSession = {
    user,
    token,
    expiresAt,
  };

  // Save session
  localStorage.setItem('authSession', JSON.stringify(session));

  return session;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('authSession');
};

// Get current session
export const getCurrentSession = (): AuthSession | null => {
  const sessionStr = localStorage.getItem('authSession');
  if (!sessionStr) return null;

  try {
    const session: AuthSession = JSON.parse(sessionStr);
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      logoutUser();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

// Get all users (for admin purposes)
export const getAllUsers = (): User[] => {
  const usersStr = localStorage.getItem('users');
  if (!usersStr) return [];

  try {
    return JSON.parse(usersStr);
  } catch {
    return [];
  }
};

// Check if user has required role
export const hasRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

// Initialize with default pre-seeded accounts if no users exist
export const initializeDefaultUsers = (): void => {
  const users = getAllUsers();
  if (users.length === 0) {
    const defaultUsers: User[] = [
      // Admin account
      {
        id: 'admin-default',
        uniqueUserId: 'ADM-2026-001',
        email: 'admin@confero.io',
        fullName: 'Dr. Sarah Mitchell',
        name: 'Dr. Sarah Mitchell',
        passwordHash: btoa('admin123' + 'salt_confero_2026'), // password: admin123
        role: 'Admin',
        organization: 'Stanford University',
        bio: 'Professor of Computer Science specializing in AI and Machine Learning',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      // Reviewer account
      {
        id: 'reviewer-default',
        uniqueUserId: 'REV-2026-001',
        email: 'reviewer@confero.io',
        fullName: 'Dr. James Wilson',
        name: 'Dr. James Wilson',
        passwordHash: btoa('reviewer123' + 'salt_confero_2026'), // password: reviewer123
        role: 'Reviewer',
        organization: 'MIT',
        bio: 'Associate Professor specializing in Natural Language Processing',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      // Volunteer account
      {
        id: 'volunteer-default',
        uniqueUserId: 'VOL-2026-001',
        email: 'volunteer@confero.io',
        fullName: 'Emily Chen',
        name: 'Emily Chen',
        passwordHash: btoa('volunteer123' + 'salt_confero_2026'), // password: volunteer123
        role: 'Volunteer',
        organization: 'UC Berkeley',
        bio: 'Graduate student and conference volunteer coordinator',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ];
    
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    localStorage.setItem('counter_Admin_2026', '1');
    localStorage.setItem('counter_Reviewer_2026', '1');
    localStorage.setItem('counter_Volunteer_2026', '1');
  }
};
