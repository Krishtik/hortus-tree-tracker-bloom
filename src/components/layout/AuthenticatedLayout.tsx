
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import OSMTreeMap from '@/components/map/OSMTreeMap';
import ProfileView from '@/components/profile/ProfileView';
import TreeLogView from '@/components/tree/TreeLogView';
import HierarchicalTreeView from '@/components/tree/HierarchicalTreeView';
import TreeDetailModal from '@/components/tree/TreeDetailModal';
import NotificationModal from '@/components/notifications/NotificationModal';
import { Tree } from '@/types/tree';

const AuthenticatedLayout = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'log' | 'profile'>('home');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { trees } = useTree();

  const handleTreeClick = (tree: Tree) => {
    setSelectedTree(tree);
  };

  // Sample hierarchical data for the tree view
  const hierarchicalData = [
    {
      id: '1',
      name: 'Urban Forest Project',
      type: 'folder' as const,
      expanded: true,
      tags: ['project', 'urban'],
      children: [
        {
          id: '1-1',
          name: 'Oak Trees',
          type: 'folder' as const,
          expanded: false,
          children: [
            { id: '1-1-1', name: 'White Oak #001', type: 'tree' as const, tags: ['mature', 'healthy'] },
            { id: '1-1-2', name: 'Red Oak #002', type: 'tree' as const, tags: ['young', 'monitoring'] }
          ]
        },
        {
          id: '1-2',
          name: 'Maple Trees',
          type: 'folder' as const,
          expanded: true,
          children: [
            { id: '1-2-1', name: 'Sugar Maple #003', type: 'tree' as const, tags: ['mature'] },
            { id: '1-2-2', name: 'Norway Maple #004', type: 'tree' as const, tags: ['diseased'] }
          ]
        }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="h-full">
            <OSMTreeMap
              trees={trees}
              onTreeClick={handleTreeClick}
              onCameraClick={() => {}}
            />
          </div>
        );
      case 'log':
        return (
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            <HierarchicalTreeView 
              data={hierarchicalData}
              onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
            />
          </div>
        );
      case 'profile':
        return (
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            <ProfileView />
          </div>
        );
      default:
        return (
          <div className="h-full">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-x-hidden">
      <EnhancedNavigation 
        onNotificationClick={() => setShowNotifications(true)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'home' | 'log' | 'profile')}
        unreadNotifications={0}
        onLogPlantClick={() => setActiveTab('log')}
      />
      
      <main className="flex-1 overflow-hidden pb-20 w-full">
        {renderContent()}
      </main>

      <BottomTabBar 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {selectedTree && (
        <TreeDetailModal
          tree={selectedTree}
          isOpen={!!selectedTree}
          onClose={() => setSelectedTree(null)}
        />
      )}

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCountChange={() => {}}
      />
    </div>
  );
};

export default AuthenticatedLayout;
