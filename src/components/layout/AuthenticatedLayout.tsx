
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import OSMTreeMap from '@/components/map/OSMTreeMap';
import TreeScanModal from '@/components/tree/TreeScanModal';
import TreeLogView from '@/components/tree/TreeLogView';
import ProfileView from '@/components/profile/ProfileView';
import TreeDetailModal from '@/components/tree/TreeDetailModal';
import NotificationModal from '@/components/notifications/NotificationModal';
import { Tree } from '@/types/tree';

const AuthenticatedLayout = () => {
  const [showScanModal, setShowScanModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'log' | 'profile'>('home');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const { trees } = useTree();

  const handleTreeClick = (tree: Tree) => {
    setSelectedTree(tree);
  };

  const handleCameraClick = () => {
    setShowScanModal(true);
  };

  const handleTabChange = (tab: 'home' | 'scan' | 'log' | 'profile') => {
    if (tab === 'scan') {
      setShowScanModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="h-full">
            <OSMTreeMap
              trees={trees}
              onTreeClick={handleTreeClick}
              onCameraClick={handleCameraClick}
            />
          </div>
        );
      case 'scan':
        setShowScanModal(true);
        setActiveTab('home');
        return null;
      case 'log':
        return <TreeLogView />;
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Enhanced Navigation */}
      <EnhancedNavigation 
        onNotificationClick={() => setShowNotifications(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadNotifications={unreadNotifications}
        onLogPlantClick={handleCameraClick}
      />
      
      {/* Main Content - extend height on desktop for map */}
      <main className={`flex-1 pb-20 md:pb-0 ${activeTab === 'home' ? 'md:h-[calc(100vh-4rem)]' : ''}`}>
        {renderTabContent()}
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="md:hidden">
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Modals */}
      <TreeScanModal 
        isOpen={showScanModal} 
        onClose={() => setShowScanModal(false)} 
      />

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCountChange={setUnreadNotifications}
      />

      {selectedTree && (
        <TreeDetailModal
          tree={selectedTree}
          isOpen={!!selectedTree}
          onClose={() => setSelectedTree(null)}
        />
      )}
    </div>
  );
};

export default AuthenticatedLayout;
