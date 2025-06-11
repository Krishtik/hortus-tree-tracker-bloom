import React, { createContext, useContext, useState, useEffect } from 'react';
import { latLngToCell } from 'h3-js';
import { Tree, TreeFormData } from '@/types/tree';
import { useAuth } from '@/contexts/AuthContext';

interface TreeContextType {
  trees: Tree[];
  userTrees: Tree[];
  addTree: (treeData: TreeFormData, location: { lat: number; lng: number }) => Promise<void>;
  updateTree: (id: string, updates: Partial<Tree>) => Promise<void>;
  deleteTree: (id: string) => Promise<void>;
  getTreesInArea: (h3Index: string) => Tree[];
  loading: boolean;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

// Sample trees for demonstration
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
      h3Index: latLngToCell(28.6139, 77.2090, 9)
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
      h3Index: latLngToCell(28.6129, 77.2085, 9)
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
      h3Index: latLngToCell(28.6149, 77.2095, 9)
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
      h3Index: latLngToCell(28.6135, 77.2100, 9)
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
  const { user } = useAuth();

  useEffect(() => {
    // Load trees from localStorage and merge with sample data
    const storedTrees = localStorage.getItem('krish_hortus_trees');
    let existingTrees: Tree[] = [];
    
    if (storedTrees) {
      try {
        existingTrees = JSON.parse(storedTrees).map((tree: any) => ({
          ...tree,
          taggedAt: new Date(tree.taggedAt)
        }));
      } catch (error) {
        console.error('Error parsing stored trees:', error);
      }
    }

    // Merge sample trees with existing trees (avoid duplicates)
    const allTrees = [...sampleTrees];
    existingTrees.forEach(tree => {
      if (!allTrees.find(t => t.id === tree.id)) {
        allTrees.push(tree);
      }
    });

    setTrees(allTrees);
    console.log('Loaded trees:', allTrees.length);
  }, []);

  const addTree = async (treeData: TreeFormData, location: { lat: number; lng: number }) => {
    if (!user) throw new Error('User must be authenticated to add trees');

    setLoading(true);
    try {
      const h3Index = latLngToCell(location.lat, location.lng, 9);
      
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
    } catch (error) {
      console.error('Error adding tree:', error);
      throw new Error('Failed to add tree. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTree = async (id: string, updates: Partial<Tree>) => {
    setLoading(true);
    try {
      const updatedTrees = trees.map(tree => 
        tree.id === id ? { ...tree, ...updates } : tree
      );
      setTrees(updatedTrees);
      localStorage.setItem('krish_hortus_trees', JSON.stringify(updatedTrees));
    } catch (error) {
      console.error('Error updating tree:', error);
      throw new Error('Failed to update tree. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTree = async (id: string) => {
    setLoading(true);
    try {
      const updatedTrees = trees.filter(tree => tree.id !== id);
      setTrees(updatedTrees);
      localStorage.setItem('krish_hortus_trees', JSON.stringify(updatedTrees));
    } catch (error) {
      console.error('Error deleting tree:', error);
      throw new Error('Failed to delete tree. Please try again.');
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
    loading
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
};
