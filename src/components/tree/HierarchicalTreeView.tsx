
import { useState } from 'react';
import { useTree } from '@/contexts/TreeContext';
import { ChevronRight, ChevronDown, TreePine, Folder, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tree } from '@/types/tree';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'tree';
  children?: TreeNode[];
  expanded?: boolean;
  tree?: Tree;
  count?: number;
}

const HierarchicalTreeView = () => {
  const { trees } = useTree();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Group trees by category to create hierarchy
  const createTreeHierarchy = (): TreeNode[] => {
    const categoryGroups: Record<string, Tree[]> = {};
    
    trees.forEach(tree => {
      if (!categoryGroups[tree.category]) {
        categoryGroups[tree.category] = [];
      }
      categoryGroups[tree.category].push(tree);
    });

    return Object.entries(categoryGroups).map(([category, categoryTrees]) => ({
      id: `category-${category}`,
      name: getCategoryDisplayName(category),
      type: 'folder' as const,
      expanded: false,
      count: categoryTrees.length,
      children: categoryTrees.map(tree => ({
        id: `tree-${tree.id}`,
        name: tree.name,
        type: 'tree' as const,
        tree: tree
      }))
    }));
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames = {
      farm: 'Farm Forestry',
      community: 'Community Forestry',
      nursery: 'Nursery',
      extension: 'Extension Forestry',
      ngo: 'NGO Partnership'
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      farm: 'emerald',
      community: 'blue',
      nursery: 'red',
      extension: 'violet',
      ngo: 'orange'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const [treeData, setTreeData] = useState<TreeNode[]>(createTreeHierarchy());

  // Update tree data when trees change
  useState(() => {
    setTreeData(createTreeHierarchy());
  });

  const toggleNode = (nodeId: string) => {
    setTreeData(prevData => 
      prevData.map(node => 
        node.id === nodeId 
          ? { ...node, expanded: !node.expanded }
          : node
      )
    );
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isSelected = selectedNodeId === node.id;
    const paddingLeft = level * 20 + 12;

    if (node.type === 'folder') {
      const categoryKey = node.name.toLowerCase().replace(/\s+/g, '');
      const colorClass = getCategoryColor(categoryKey);
      
      return (
        <div key={node.id}>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left p-2 h-auto ${
              isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={() => {
              toggleNode(node.id);
              handleNodeSelect(node.id);
            }}
          >
            <div className="flex items-center space-x-2 w-full">
              {node.expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
              <Folder className="h-4 w-4 text-blue-600" />
              <span className="font-medium flex-1">{node.name}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs bg-${colorClass}-100 text-${colorClass}-800 dark:bg-${colorClass}-900 dark:text-${colorClass}-100`}
              >
                {node.count}
              </Badge>
            </div>
          </Button>
          {node.expanded && node.children && (
            <div>
              {node.children.map(child => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Tree node
    const tree = node.tree!;
    return (
      <Button
        key={node.id}
        variant="ghost"
        className={`w-full justify-start text-left p-2 h-auto ${
          isSelected ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => handleNodeSelect(node.id)}
      >
        <div className="flex items-center space-x-2 w-full">
          <TreePine className="h-4 w-4 text-green-600" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{tree.name}</div>
            <div className="text-xs text-gray-500 italic truncate">{tree.scientificName}</div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{tree.location.lat.toFixed(4)}, {tree.location.lng.toFixed(4)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {tree.isVerified && (
              <Badge variant="default" className="bg-green-500 text-white text-xs">
                ✓
              </Badge>
            )}
            {tree.isAIGenerated && (
              <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
                AI
              </Badge>
            )}
          </div>
        </div>
      </Button>
    );
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <TreePine className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tree Inventory</h2>
          <Badge variant="secondary" className="ml-auto">
            {trees.length} Total
          </Badge>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {treeData.length > 0 ? (
          <div className="py-2">
            {treeData.map(node => renderTreeNode(node))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <TreePine className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No trees logged yet</p>
            <p className="text-sm">Start tagging trees on the map to build your inventory!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchicalTreeView;
