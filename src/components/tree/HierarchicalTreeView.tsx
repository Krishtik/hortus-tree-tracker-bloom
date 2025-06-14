
import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus, Search, Filter, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'tree' | 'plant';
  children?: TreeNode[];
  tags?: string[];
  expanded?: boolean;
  selected?: boolean;
}

interface HierarchicalTreeViewProps {
  data: TreeNode[];
  onNodeSelect?: (nodeId: string) => void;
  onBulkAction?: (nodeIds: string[], action: string) => void;
}

const HierarchicalTreeView = ({ data, onNodeSelect, onBulkAction }: HierarchicalTreeViewProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

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
    setTreeData(updateNode(treeData));
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

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.expanded;
    const isSelected = selectedNodes.has(node.id);

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
            <div className={`w-3 h-3 rounded-full ${
              node.type === 'folder' ? 'bg-blue-500' : 
              node.type === 'tree' ? 'bg-green-500' : 'bg-purple-500'
            }`} />
            
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {node.name}
            </span>
            
            {node.tags && (
              <div className="flex space-x-1">
                {node.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
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
              placeholder="Search trees and plants..."
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
      </div>
      
      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto">
        {treeData.map(node => renderNode(node))}
      </div>
    </div>
  );
};

export default HierarchicalTreeView;
