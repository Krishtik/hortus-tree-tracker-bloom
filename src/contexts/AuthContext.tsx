
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
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
  }, []);

  const initializeAuth = async () => {
    setLoading(true);
    
    try {
      // Check if token is valid
      if (authService.isTokenValid()) {
        // Try to get current user from API
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Try to refresh token
          try {
            const authResponse = await authService.refreshToken();
            setUser(authResponse.user);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Fallback to stored user for demo mode
            const storedUser = authService.getStoredUser();
            if (storedUser) {
              setUser(storedUser);
            }
          }
        }
      } else {
        // Fallback to stored user for demo mode
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authResponse = await authService.login({ email, password });
      setUser(authResponse.user);
    } catch (error) {
      console.error('Login error:', error);
      // Fallback for demo mode
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: 'USER' as const,
        isVerified: true,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('krish_hortus_user', JSON.stringify(userData));
      throw new Error('Backend not connected - using demo mode');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const authResponse = await authService.register({ email, password, name: name || email.split('@')[0] });
      setUser(authResponse.user);
    } catch (error) {
      console.error('Signup error:', error);
      // Fallback for demo mode
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split('@')[0],
        role: 'USER' as const,
        isVerified: false,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('krish_hortus_user', JSON.stringify(userData));
      throw new Error('Backend not connected - using demo mode');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const authResponse = await authService.refreshToken();
      setUser(authResponse.user);
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
