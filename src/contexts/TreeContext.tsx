
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

export const TreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load trees from localStorage (temporary until backend is ready)
    const storedTrees = localStorage.getItem('krish_hortus_trees');
    if (storedTrees) {
      try {
        const parsedTrees = JSON.parse(storedTrees).map((tree: any) => ({
          ...tree,
          taggedAt: new Date(tree.taggedAt)
        }));
        setTrees(parsedTrees);
      } catch (error) {
        console.error('Error parsing stored trees:', error);
      }
    }
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
          // Convert File objects to URLs (in production, these would be uploaded to cloud storage)
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
