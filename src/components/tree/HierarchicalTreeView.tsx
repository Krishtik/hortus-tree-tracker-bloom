
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, Filter, Tag, TreePine, Users, Building, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useTree } from '@/contexts/TreeContext';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'tree' | 'plant';
  children?: TreeNode[];
  tags?: string[];
  expanded?: boolean;
  selected?: boolean;
  category?: string;
  scientificName?: string;
  isVerified?: boolean;
  isAIGenerated?: boolean;
}

interface HierarchicalTreeViewProps {
  onNodeSelect?: (nodeId: string) => void;
  onBulkAction?: (nodeIds: string[], action: string) => void;
}

const HierarchicalTreeView = ({ onNodeSelect, onBulkAction }: HierarchicalTreeViewProps) => {
  const { trees } = useTree();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Transform real tree data into hierarchical structure
  const treeData = useMemo(() => {
    const categoryIcons = {
      farm: TreePine,
      community: Users,
      nursery: Sprout
    };

    const categories = trees.reduce((acc, tree) => {
      if (!acc[tree.category]) {
        acc[tree.category] = [];
      }
      acc[tree.category].push(tree);
      return acc;
    }, {} as Record<string, typeof trees>);

    return Object.entries(categories).map(([category, categoryTrees]) => ({
      id: `category-${category}`,
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Forestry (${categoryTrees.length})`,
      type: 'folder' as const,
      expanded: true,
      category,
      children: categoryTrees.map(tree => ({
        id: tree.id,
        name: tree.name,
        type: 'tree' as const,
        scientificName: tree.scientificName,
        category: tree.category,
        isVerified: tree.isVerified,
        isAIGenerated: tree.isAIGenerated,
        tags: [
          tree.category,
          ...(tree.isVerified ? ['verified'] : []),
          ...(tree.isAIGenerated ? ['ai-generated'] : []),
          ...(tree.localName ? ['local-name'] : [])
        ]
      }))
    }));
  }, [trees]);

  const [hierarchicalData, setHierarchicalData] = useState<TreeNode[]>(treeData);

  // Update hierarchical data when trees change
  useMemo(() => {
    setHierarchicalData(treeData);
  }, [treeData]);

  const toggleNode = (nodeId: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setHierarchicalData(updateNode(hierarchicalData));
  };

  const toggleSelection = (nodeId: string) => {
    const newSelected = new Set(selectedNodes);
    if (newSelected.has(nodeId)) {
      newSelected.delete(nodeId);
    } else {
      newSelected.add(nodeId);
    }
    setSelectedNodes(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return hierarchicalData;
    
    const filterNode = (node: TreeNode): TreeNode | null => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (node.children) {
        const filteredChildren = node.children.map(filterNode).filter(Boolean) as TreeNode[];
        if (filteredChildren.length > 0 || matchesSearch) {
          return {
            ...node,
            children: filteredChildren,
            expanded: true
          };
        }
      }
      
      return matchesSearch ? node : null;
    };
    
    return hierarchicalData.map(filterNode).filter(Boolean) as TreeNode[];
  }, [hierarchicalData, searchTerm]);

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.expanded;
    const isSelected = selectedNodes.has(node.id);

    const getCategoryIcon = (category?: string) => {
      if (category === 'farm') return TreePine;
      if (category === 'community') return Users;
      if (category === 'nursery') return Sprout;
      return Building;
    };

    const Icon = node.type === 'folder' ? getCategoryIcon(node.category) : TreePine;

    return (
      <div key={node.id} className="w-full">
        <div 
          className={`flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group ${
            isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelection(node.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
          
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleNode(node.id)}
              className="w-6 h-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex-1 flex items-center space-x-3">
            <Icon className={`h-4 w-4 ${
              node.category === 'farm' ? 'text-emerald-500' :
              node.category === 'community' ? 'text-blue-500' :
              node.category === 'nursery' ? 'text-red-500' : 'text-gray-500'
            }`} />
            
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {node.name}
              </span>
              {node.scientificName && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  {node.scientificName}
                </p>
              )}
            </div>
            
            {node.tags && (
              <div className="flex space-x-1">
                {node.isVerified && (
                  <Badge variant="default" className="text-xs bg-green-500 text-white">
                    ✓
                  </Badge>
                )}
                {node.isAIGenerated && (
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                    🤖
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs capitalize">
                  {node.category}
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="animate-accordion-down">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Search and Filter Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trees, scientific names, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 dark:border-gray-600"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {showBulkActions && (
          <div className="flex items-center space-x-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg animate-fade-in">
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {selectedNodes.size} items selected
            </span>
            <Button size="sm" variant="outline">
              <Tag className="h-4 w-4 mr-1" />
              Tag
            </Button>
            <Button size="sm" variant="outline">
              Export
            </Button>
          </div>
        )}

        {/* Statistics Summary */}
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <p>Total: {trees.length} trees | Showing: {filteredData.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)} results</p>
        </div>
      </div>
      
      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center">
            <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No trees match your search' : 'No trees tagged yet'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mt-1">
                Start by tagging trees on the map
              </p>
            )}
          </div>
        ) : (
          filteredData.map(node => renderNode(node))
        )}
      </div>
    </div>
  );
};

export default HierarchicalTreeView;
