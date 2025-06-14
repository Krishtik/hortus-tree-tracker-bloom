
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
import { Search, TreePine } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AuthenticatedContent = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'log' | 'profile'>('home');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showTreeView, setShowTreeView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { trees } = useTree();

  const handleTreeClick = (tree: Tree) => {
    setSelectedTree(tree);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use Nominatim API to search for places
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const results = await response.json();
      
      if (results.length > 0) {
        const result = results[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Trigger map navigation to the searched location
        const mapEvent = new CustomEvent('navigateToLocation', {
          detail: { lat, lng, zoom: 15 }
        });
        window.dispatchEvent(mapEvent);
        
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="relative h-full">
            {/* Full-screen map */}
            <div className="absolute inset-0">
              <OSMTreeMap 
                trees={trees} 
                onTreeClick={handleTreeClick}
                onCameraClick={() => {}}
              />
            </div>
            
            {/* Floating Top Navigation Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2">
              <div className="flex items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl px-3 py-2">
                <Input
                  placeholder="Search places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-48 border-0 bg-transparent focus:ring-0 text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="p-1 h-auto"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  ) : (
                    <Search className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              </div>
              
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
                <TreePine className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Log</span>
              </Button>
            </div>

            {/* Tree View Overlay */}
            {showTreeView && (
              <div className="absolute top-20 left-4 right-4 bottom-20 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <HierarchicalTreeView />
                </div>
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
          <div className="absolute inset-0">
            <OSMTreeMap 
              trees={trees} 
              onTreeClick={handleTreeClick}
              onCameraClick={() => {}}
            />
          </div>
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
