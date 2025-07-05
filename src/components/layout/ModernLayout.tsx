
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import ModernTabNavigation from '@/components/navigation/ModernTabNavigation';
import HierarchicalTreeView from '@/components/tree/HierarchicalTreeView';
import OSMTreeMap from '@/components/map/OSMTreeMap';
import ProfileView from '@/components/profile/ProfileView';
import TreeLogView from '@/components/tree/TreeLogView';
//import TreeDetailModal from '@/components/tree/TreeDetailModal';
import NotificationModal from '@/components/notifications/NotificationModal';
import { Tree } from '@/types/tree';

const ModernLayout = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { trees } = useTree();

  const handleTreeClick = (tree: Tree) => {
    setSelectedTree(tree);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="h-full">
            <OSMTreeMap
              trees={trees}
              onTreeClick={handleTreeClick}
              onCameraClick={() => {}} // Removed camera functionality
            />
          </div>
        );
      case 'trees':
        return (
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            <HierarchicalTreeView 
              onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
            />
          </div>
        );
      case 'analytics':
        return (
          <div className="h-full p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Total Trees</h3>
                  <p className="text-3xl font-bold text-green-600">{trees.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Healthy Trees</h3>
                  <p className="text-3xl font-bold text-blue-600">85%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Areas Covered</h3>
                  <p className="text-3xl font-bold text-purple-600">12</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            <TreeLogView />
          </div>
        );
      case 'profile':
        return (
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            <ProfileView />
          </div>
        );
      case 'about':
        return (
          <div className="h-full p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About Krish Hortus</h2>
              <div className="bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Krish Hortus is an advanced AI-powered tree mapping and monitoring platform designed to revolutionize 
                  urban forestry management. Our platform combines cutting-edge technology with environmental stewardship 
                  to create sustainable urban ecosystems.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Features</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li>• Real-time tree monitoring</li>
                      <li>• AI-powered health assessment</li>
                      <li>• Interactive mapping system</li>
                      <li>• Data analytics and reporting</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Mission</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      To empower communities and organizations with the tools needed to create and maintain 
                      thriving urban forests for future generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <ModernTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* {selectedTree && (
        <TreeDetailModal
          tree={selectedTree}
          isOpen={!!selectedTree}
          onClose={() => setSelectedTree(null)}
        />
      )} */}

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCountChange={() => {}}
      />
    </div>
  );
};

export default ModernLayout;
