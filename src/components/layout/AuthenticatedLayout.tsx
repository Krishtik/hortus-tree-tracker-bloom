
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';

const AuthenticatedLayout = () => {
  const location = useLocation();
  const isMapPage = location.pathname === '/';
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleTabChange = (tab: 'home' | 'profile') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation - Hidden on mobile map view */}
      <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0 relative z-40`}>
        <EnhancedNavigation onNotificationClick={handleNotificationClick} />
      </div>
      
      {/* Main Content Area */}
      <main className={`flex-1 relative ${isMapPage ? 'h-screen md:h-auto' : ''}`}>
        <div className={`w-full ${isMapPage ? 'h-full pb-20 md:pb-0' : 'min-h-full'}`}>
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation - Only on mobile map view */}
      {isMapPage && (
        <div className="md:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
    </div>
  );
};

export default AuthenticatedLayout;
