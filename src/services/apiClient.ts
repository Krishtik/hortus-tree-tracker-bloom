import { API_CONFIG, getAuthHeaders } from '@/config/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  timestamp?: string;
}

interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('krish_hortus_token');
  }

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem('krish_hortus_token', token);
  }

  public clearToken() {
    this.token = null;
    localStorage.removeItem('krish_hortus_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(this.token || undefined),
        ...options.headers,
      },
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);

      const raw = await response.text();
      let parsed: any;

      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error(`Invalid JSON response: ${raw}`);
      }

      if (!response.ok) {
        const errorData: ApiError = parsed || {
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR',
          timestamp: new Date().toISOString(),
        };
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      // Handle both wrapped and flat responses
      const result: T = parsed.data ?? parsed;
      console.log('API Response:', result);

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
