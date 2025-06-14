
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';
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
          <div className="h-full relative">
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
        return (
          <div className="h-full bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <TreeLogView />
          </div>
        );
      case 'profile':
        return (
          <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ProfileView />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex flex-col">
      {/* Enhanced Navigation with glass morphism effect */}
      <div className="relative z-50">
        <EnhancedNavigation 
          onNotificationClick={() => setShowNotifications(true)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadNotifications={unreadNotifications}
          onLogPlantClick={handleCameraClick}
        />
      </div>
      
      {/* Main Content with smooth transitions */}
      <main className={`flex-1 pb-20 md:pb-0 transition-all duration-300 ease-in-out ${
        activeTab === 'home' 
          ? 'md:h-[calc(100vh-4rem)]' 
          : 'md:h-[calc(100vh-4rem)] overflow-y-auto'
      }`}>
        <div className="h-full">
          {renderTabContent()}
        </div>
      </main>

      {/* Desktop Bottom Tab Bar with glass morphism */}
      {activeTab === 'home' && (
        <div className="hidden md:block">
          <BottomTabBar 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation with enhanced styling */}
      <div className="md:hidden">
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Modals with improved animations */}
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
