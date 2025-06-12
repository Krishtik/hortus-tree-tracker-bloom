
import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api';
import { Tree, TreeFormData } from '@/types/tree';

export interface TreeSearchParams {
  category?: string;
  species?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
  h3Index?: string;
  verified?: boolean;
  page?: number;
  size?: number;
}

export interface TreeResponse {
  trees: Tree[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface NearbyTreesParams {
  lat: number;
  lng: number;
  radius: number; // in kilometers
  limit?: number;
}

class TreeService {
  async getAllTrees(params?: TreeSearchParams): Promise<TreeResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'location') {
              const location = value as TreeSearchParams['location'];
              queryParams.append('lat', location!.lat.toString());
              queryParams.append('lng', location!.lng.toString());
              queryParams.append('radius', location!.radius.toString());
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.TREES.BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<TreeResponse>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('Get trees error:', error);
      throw new Error('Failed to fetch trees');
    }
  }

  async getTreeById(id: string): Promise<Tree> {
    try {
      const response = await apiClient.get<Tree>(`${API_CONFIG.ENDPOINTS.TREES.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get tree error:', error);
      throw new Error('Failed to fetch tree details');
    }
  }

  async createTree(treeData: TreeFormData, location: { lat: number; lng: number }): Promise<Tree> {
    try {
      const payload = {
        ...treeData,
        location: {
          lat: location.lat,
          lng: location.lng
        }
      };

      const response = await apiClient.post<Tree>(API_CONFIG.ENDPOINTS.TREES.BASE, payload);
      return response.data;
    } catch (error) {
      console.error('Create tree error:', error);
      throw new Error('Failed to create tree');
    }
  }

  async updateTree(id: string, updates: Partial<Tree>): Promise<Tree> {
    try {
      const response = await apiClient.patch<Tree>(`${API_CONFIG.ENDPOINTS.TREES.BASE}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update tree error:', error);
      throw new Error('Failed to update tree');
    }
  }

  async deleteTree(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.TREES.BASE}/${id}`);
    } catch (error) {
      console.error('Delete tree error:', error);
      throw new Error('Failed to delete tree');
    }
  }

  async getNearbyTrees(params: NearbyTreesParams): Promise<Tree[]> {
    try {
      const queryParams = new URLSearchParams({
        lat: params.lat.toString(),
        lng: params.lng.toString(),
        radius: params.radius.toString(),
        ...(params.limit && { limit: params.limit.toString() })
      });

      const response = await apiClient.get<Tree[]>(`${API_CONFIG.ENDPOINTS.TREES.NEARBY}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get nearby trees error:', error);
      throw new Error('Failed to fetch nearby trees');
    }
  }

  async verifyTree(id: string): Promise<Tree> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.TREES.VERIFY.replace('{id}', id);
      const response = await apiClient.post<Tree>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Verify tree error:', error);
      throw new Error('Failed to verify tree');
    }
  }

  async uploadTreePhotos(treeId: string, photos: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });
      formData.append('treeId', treeId);

      const response = await apiClient.uploadFile<string[]>(API_CONFIG.ENDPOINTS.UPLOAD.PHOTOS, formData);
      return response.data;
    } catch (error) {
      console.error('Upload photos error:', error);
      throw new Error('Failed to upload photos');
    }
  }

  // Fallback to localStorage for demo mode
  async getFallbackTrees(): Promise<Tree[]> {
    const storedTrees = localStorage.getItem('krish_hortus_trees');
    if (storedTrees) {
      try {
        return JSON.parse(storedTrees).map((tree: any) => ({
          ...tree,
          taggedAt: new Date(tree.taggedAt)
        }));
      } catch (error) {
        console.error('Error parsing stored trees:', error);
      }
    }
    return [];
  }
}

export const treeService = new TreeService();
