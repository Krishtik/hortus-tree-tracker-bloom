
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';

/**
 * Props interface for AuthenticatedLayout component
 */
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component for authenticated users
 * Provides navigation, responsive layout, and tab management
 * Handles mobile-first design with bottom navigation on mobile and top navigation on desktop
 */
const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const location = useLocation();
  const isMapPage = location.pathname === '/';
  
  // State for active tab - controls bottom navigation on mobile
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  /**
   * Handles notification button clicks in the top navigation
   * Currently logs the action - can be extended for notification management
   */
  const handleNotificationClick = () => {
    console.log('Notification clicked - opening notification panel');
    // This can be extended to show notification dropdown or modal
  };

  /**
   * Handles tab changes in the bottom navigation (mobile only)
   * Updates the active tab state for proper highlighting
   */
  const handleTabChange = (tab: 'home' | 'profile') => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
    // This can be extended to handle actual navigation between views
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 
        Top Navigation Bar
        Hidden on mobile map view to maximize map space
        Always visible on desktop and non-map pages
      */}
      <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0 relative z-40`}>
        <EnhancedNavigation onNotificationClick={handleNotificationClick} />
      </div>
      
      {/* 
        Main Content Area
        Takes full height on map pages, standard height on other pages
        Adds bottom padding on mobile map view to account for bottom navigation
      */}
      <main className={`flex-1 relative ${isMapPage ? 'h-screen md:h-auto' : ''}`}>
        <div className={`w-full ${isMapPage ? 'h-full pb-20 md:pb-0' : 'min-h-full'}`}>
          {children}
        </div>
      </main>
      
      {/* 
        Bottom Navigation
        Only visible on mobile map view for optimal map interaction
        Fixed position with proper z-index for overlay functionality
      */}
      {isMapPage && (
        <div className="md:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <BottomTabBar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
        </div>
      )}
    </div>
  );
};

export default AuthenticatedLayout;
