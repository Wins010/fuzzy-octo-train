import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthSession, RegisterFormData, LoginFormData } from '@/types';
import {
  getCurrentSession,
  loginUser as authLoginUser,
  registerUser as authRegisterUser,
  logoutUser as authLogoutUser,
  initializeDefaultUsers,
} from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (formData: LoginFormData) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default users on first load
    initializeDefaultUsers();
    
    // Check for existing session
    const currentSession = getCurrentSession();
    setSession(currentSession);
    setIsLoading(false);
  }, []);

  const login = async (formData: LoginFormData) => {
    const newSession = await authLoginUser(formData);
    setSession(newSession);
  };

  const register = async (formData: RegisterFormData) => {
    const user = await authRegisterUser(formData);
    // Auto-login after registration
    await login({ email: user.email, password: formData.password });
  };

  const logout = () => {
    authLogoutUser();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
