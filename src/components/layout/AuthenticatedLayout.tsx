import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const location = useLocation();
  const isMapPage = location.pathname === '/';

  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  const handleNotificationClick = () => {
    console.log('Notification clicked - opening notification panel');
  };

  const handleTabChange = (tab: 'home' | 'profile') => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation */}
      <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0 relative z-40`}>
        <EnhancedNavigation onNotificationClick={handleNotificationClick} />
      </div>

      {/* Main Content */}
      <main className={`flex-1 relative ${isMapPage ? 'h-screen md:h-full' : ''}`}>
        <div className={`w-full ${isMapPage ? 'h-full pb-20 md:pb-0' : 'min-h-full'}`}>
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      {isMapPage && (
        <div className="md:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
    </div>
  );
};

export default AuthenticatedLayout;
