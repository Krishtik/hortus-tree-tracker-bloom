import React, { createContext, useContext, useState, useEffect } from 'react';
import { latLngToCell } from 'h3-js';
import { Tree, TreeFormData } from '@/types/tree';
import { useAuth } from '@/contexts/AuthContext';
import { treeService, TreeSearchParams } from '@/services/treeService';
import { toast } from '@/hooks/use-toast';

interface TreeContextType {
  trees: Tree[];
  userTrees: Tree[];
  addTree: (treeData: TreeFormData, location: { lat: number; lng: number }) => Promise<void>;
  updateTree: (id: string, updates: Partial<Tree>) => Promise<void>;
  deleteTree: (id: string) => Promise<void>;
  getTreesInArea: (h3Index: string) => Tree[];
  searchTrees: (params: TreeSearchParams) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

// Sample trees for demo mode with H3 resolution 15
const sampleTrees: Tree[] = [
  {
    id: 'sample-1',
    name: 'Mango Tree',
    scientificName: 'Mangifera indica',
    localName: 'आम का पेड़',
    category: 'farm',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      h3Index: latLngToCell(28.6139, 77.2090, 15)
    },
    measurements: {
      height: 15,
      trunkWidth: 45
    },
    photos: {},
    metadata: {},
    taggedBy: 'demo-user',
    taggedAt: new Date('2024-01-15'),
    isAIGenerated: true,
    isVerified: false
  },
  {
    id: 'sample-2',
    name: 'Neem Tree',
    scientificName: 'Azadirachta indica',
    localName: 'नीम का पेड़',
    category: 'community',
    location: {
      lat: 28.6129,
      lng: 77.2085,
      h3Index: latLngToCell(28.6129, 77.2085, 15)
    },
    measurements: {
      height: 12,
      trunkWidth: 35
    },
    photos: {},
    metadata: {},
    taggedBy: 'demo-user',
    taggedAt: new Date('2024-01-16'),
    isAIGenerated: true,
    isVerified: true
  },
  {
    id: 'sample-3',
    name: 'Rose Plant',
    scientificName: 'Rosa indica',
    localName: 'गुलाब का पौधा',
    category: 'nursery',
    location: {
      lat: 28.6149,
      lng: 77.2095,
      h3Index: latLngToCell(28.6149, 77.2095, 15)
    },
    measurements: {
      height: 2,
      trunkWidth: 5
    },
    photos: {},
    metadata: {},
    taggedBy: 'demo-user',
    taggedAt: new Date('2024-01-17'),
    isAIGenerated: false,
    isVerified: true
  },
  {
    id: 'sample-4',
    name: 'Banyan Tree',
    scientificName: 'Ficus benghalensis',
    localName: 'बरगद का पेड़',
    category: 'community',
    location: {
      lat: 28.6135,
      lng: 77.2100,
      h3Index: latLngToCell(28.6135, 77.2100, 15)
    },
    measurements: {
      height: 25,
      trunkWidth: 120
    },
    photos: {},
    metadata: {},
    taggedBy: 'demo-user',
    taggedAt: new Date('2024-01-18'),
    isAIGenerated: false,
    isVerified: true
  }
];

export const TreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadTrees();
  }, []);

  const loadTrees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from backend
      const treeResponse = await treeService.getAllTrees();
      setTrees(treeResponse.trees);
      console.log('Loaded trees from backend:', treeResponse.trees.length);
    } catch (error) {
      console.error('Failed to load trees from backend:', error);
      // Fallback to localStorage and sample data
      const fallbackTrees = await treeService.getFallbackTrees();
      const allTrees = [...sampleTrees];
      
      fallbackTrees.forEach(tree => {
        if (!allTrees.find(t => t.id === tree.id)) {
          allTrees.push(tree);
        }
      });
      
      setTrees(allTrees);
      console.log('Using fallback trees:', allTrees.length);
    } finally {
      setLoading(false);
    }
  };

  const addTree = async (treeData: TreeFormData, location: { lat: number; lng: number }) => {
    if (!user) throw new Error('User must be authenticated to add trees');

    setLoading(true);
    setError(null);
    
    try {
      // Try to create tree via backend
      const newTree = await treeService.createTree(treeData, location);
      setTrees(prev => [...prev, newTree]);
      
      // Real-time notification for successful tree tagging
      toast({
        title: "Tree Tagged Successfully! 🌳",
        description: `${treeData.name} has been tagged at H3: ${latLngToCell(location.lat, location.lng, 15).slice(0, 12)}...`,
      });
      
      console.log('Tree created via backend:', newTree.id);
    } catch (error) {
      console.error('Failed to create tree via backend:', error);
      
      // Fallback to localStorage
      const h3Index = latLngToCell(location.lat, location.lng, 15);
      
      const newTree: Tree = {
        id: Math.random().toString(36).substr(2, 9),
        name: treeData.name,
        scientificName: treeData.scientificName,
        localName: treeData.localName,
        category: treeData.category,
        location: {
          lat: location.lat,
          lng: location.lng,
          h3Index
        },
        measurements: {
          height: treeData.height,
          trunkWidth: treeData.trunkWidth
        },
        photos: {
          tree: treeData.photos.tree ? URL.createObjectURL(treeData.photos.tree) : undefined,
          leaves: treeData.photos.leaves ? URL.createObjectURL(treeData.photos.leaves) : undefined,
          bark: treeData.photos.bark ? URL.createObjectURL(treeData.photos.bark) : undefined,
          fruit: treeData.photos.fruit ? URL.createObjectURL(treeData.photos.fruit) : undefined,
          flower: treeData.photos.flower ? URL.createObjectURL(treeData.photos.flower) : undefined,
        },
        metadata: {},
        taggedBy: user.id,
        taggedAt: new Date(),
        isAIGenerated: false,
        isVerified: false
      };

      const updatedTrees = [...trees, newTree];
      setTrees(updatedTrees);
      localStorage.setItem('krish_hortus_trees', JSON.stringify(updatedTrees));
      
      // Real-time notification for successful tree tagging
      toast({
        title: "Tree Tagged Successfully! 🌳",
        description: `${treeData.name} has been tagged at H3: ${h3Index.slice(0, 12)}...`,
      });
      
      console.log('Tree created in fallback mode:', newTree.id);
    } finally {
      setLoading(false);
    }
  };

  const updateTree = async (id: string, updates: Partial<Tree>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to update via backend
      const updatedTree = await treeService.updateTree(id, updates);
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree));
      
      // Real-time notification for tree updates
      toast({
        title: "Tree Updated! 📝",
        description: `Tree information has been successfully updated.`,
      });
      
      console.log('Tree updated via backend:', id);
    } catch (error) {
      console.error('Failed to update tree via backend:', error);
      
      // Fallback to localStorage
      const updatedTrees = trees.map(tree => 
        tree.id === id ? { ...tree, ...updates } : tree
      );
      setTrees(updatedTrees);
      localStorage.setItem('krish_hortus_trees', JSON.stringify(updatedTrees));
      
      // Real-time notification for tree updates
      toast({
        title: "Tree Updated! 📝",
        description: `Tree information has been successfully updated.`,
      });
      
      console.log('Tree updated in fallback mode:', id);
    } finally {
      setLoading(false);
    }
  };

  const deleteTree = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to delete via backend
      await treeService.deleteTree(id);
      setTrees(prev => prev.filter(tree => tree.id !== id));
      console.log('Tree deleted via backend:', id);
    } catch (error) {
      console.error('Failed to delete tree via backend:', error);
      
      // Fallback to localStorage
      const updatedTrees = trees.filter(tree => tree.id !== id);
      setTrees(updatedTrees);
      localStorage.setItem('krish_hortus_trees', JSON.stringify(updatedTrees));
      console.log('Tree deleted in fallback mode:', id);
    } finally {
      setLoading(false);
    }
  };

  const searchTrees = async (params: TreeSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const treeResponse = await treeService.getAllTrees(params);
      setTrees(treeResponse.trees);
      console.log('Trees searched via backend:', treeResponse.trees.length);
    } catch (error) {
      console.error('Failed to search trees via backend:', error);
      setError('Failed to search trees');
    } finally {
      setLoading(false);
    }
  };

  const getTreesInArea = (h3Index: string) => {
    return trees.filter(tree => tree.location.h3Index === h3Index);
  };

  const userTrees = trees.filter(tree => tree.taggedBy === user?.id);

  const value = {
    trees,
    userTrees,
    addTree,
    updateTree,
    deleteTree,
    getTreesInArea,
    searchTrees,
    loading,
    error
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
};
