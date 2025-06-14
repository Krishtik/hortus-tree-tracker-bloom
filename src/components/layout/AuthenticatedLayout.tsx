
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TreeProvider } from '@/contexts/TreeContext';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import OSMTreeMap from '@/components/map/OSMTreeMap';
import TreeLogView from '@/components/tree/TreeLogView';
import HierarchicalTreeView from '@/components/tree/HierarchicalTreeView';
import ProfileView from '@/components/profile/ProfileView';
import TreeDetailModal from '@/components/tree/TreeDetailModal';
import { Tree } from '@/types/tree';
import { useTree } from '@/contexts/TreeContext';
import { Button } from '@/components/ui/button';
import { FileText, TreePine } from 'lucide-react';

const AuthenticatedContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showTreeView, setShowTreeView] = useState(false);
  const { trees } = useTree();

  const handleTreeClick = (tree: Tree) => {
    setSelectedTree(tree);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="relative h-full">
            <OSMTreeMap 
              trees={trees} 
              onTreeClick={handleTreeClick}
              onCameraClick={() => {}}
            />
            
            {/* Top Navigation Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTreeView(!showTreeView)}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl"
              >
                <TreePine className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Trees</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('log')}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl"
              >
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Log</span>
              </Button>
            </div>

            {/* Tree View Overlay */}
            {showTreeView && (
              <div className="absolute top-20 left-4 right-4 bottom-4 z-20 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <HierarchicalTreeView />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTreeView(false)}
                  className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        );
      case 'log':
        return <TreeLogView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <OSMTreeMap 
            trees={trees} 
            onTreeClick={handleTreeClick}
            onCameraClick={() => {}}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="flex-1 relative">
        {renderTabContent()}
      </div>
      
      <BottomTabBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      {selectedTree && (
        <TreeDetailModal
          tree={selectedTree}
          isOpen={true}
          onClose={() => setSelectedTree(null)}
        />
      )}
    </div>
  );
};

const AuthenticatedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <TreeProvider>
      <AuthenticatedContent />
    </TreeProvider>
  );
};

export default AuthenticatedLayout;
