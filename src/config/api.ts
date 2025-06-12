
// API configuration for backend integration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile'
    },
    TREES: {
      BASE: '/trees',
      SEARCH: '/trees/search',
      NEARBY: '/trees/nearby',
      CATEGORIES: '/trees/categories',
      VERIFY: '/trees/{id}/verify'
    },
    UPLOAD: {
      PRESIGNED_URL: '/upload/presigned-url',
      PHOTOS: '/upload/photos'
    },
    AI: {
      IDENTIFY: '/ai/identify',
      ANALYZE: '/ai/analyze'
    },
    ANALYTICS: {
      REGIONAL: '/analytics/regional',
      SPECIES: '/analytics/species'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const getAuthHeaders = (token?: string) => ({
  ...API_CONFIG.HEADERS,
  ...(token && { Authorization: `Bearer ${token}` })
});
