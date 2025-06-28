import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line
  }, []);

  const initializeAuth = async () => {
    setLoading(true);
    try {
      if (authService.isTokenValid()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          try {
            const authResponse = await authService.refreshToken();
            setUser({
              id: authResponse.id,
              username: authResponse.username,
              email: authResponse.email,
              roles: authResponse.roles,
              // ...any other fields you want
            });
          } catch {
            setUser(authService.getStoredUser() || null);
          }
        }
      } else {
        setUser(authService.getStoredUser() || null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      const authResponse = await authService.login({ usernameOrEmail, password });
      setUser({
          id: authResponse.id,
          username: authResponse.username,
          email: authResponse.email,
          roles: authResponse.roles,
          // ...any other fields you want
        });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username?: string) => {
    setLoading(true);
    try {
      const authResponse = await authService.register({
        username: username || email.split('@')[0],
        email,
        password,
      });
      setUser(authResponse.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const authResponse = await authService.refreshToken();
      setUser(authResponse.user);
    } catch {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};