import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isVerified: boolean;
  createdAt: string;
  profilePicture?: string;
}

export interface LoginRequest {
  username: string; // <-- Use username for login, since backend expects it
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      if (response.success) {
        apiClient.setToken(response.data.token);
        localStorage.setItem('krish_hortus_token', response.data.token);
        localStorage.setItem('krish_hortus_refresh_token', response.data.refreshToken);
        localStorage.setItem('krish_hortus_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );
      if (response.success) {
        apiClient.setToken(response.data.token);
        localStorage.setItem('krish_hortus_token', response.data.token);
        localStorage.setItem('krish_hortus_refresh_token', response.data.refreshToken);
        localStorage.setItem('krish_hortus_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.clearToken();
      localStorage.removeItem('krish_hortus_token');
      localStorage.removeItem('krish_hortus_refresh_token');
      localStorage.removeItem('krish_hortus_user');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('krish_hortus_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      if (response.success) {
        apiClient.setToken(response.data.token);
        localStorage.setItem('krish_hortus_token', response.data.token);
        localStorage.setItem('krish_hortus_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw new Error('Failed to get user profile');
    }
  }

  getStoredUser(): User | null {
    const storedUser = localStorage.getItem('krish_hortus_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('krish_hortus_user');
      }
    }
    return null;
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('krish_hortus_token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();