
import { Outlet, useLocation } from 'react-router-dom';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';

const AuthenticatedLayout = () => {
  const location = useLocation();
  const isMapPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation - Hidden on mobile map view */}
      <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0`}>
        <EnhancedNavigation />
      </div>
      
      {/* Main Content Area */}
      <main className={`flex-1 relative ${isMapPage ? 'h-screen md:h-auto' : ''}`}>
        <div className={`w-full ${isMapPage ? 'h-full' : 'min-h-full'}`}>
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation - Only on mobile map view */}
      {isMapPage && (
        <div className="md:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
          <BottomTabBar />
        </div>
      )}
    </div>
  );
};

export default AuthenticatedLayout;
