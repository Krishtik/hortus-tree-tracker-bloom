// import { useLocation } from 'react-router-dom';
// import { useState } from 'react';
// import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
// import BottomTabBar from '@/components/navigation/BottomTabBar';

// interface AuthenticatedLayoutProps {
//   children: React.ReactNode;
// }

// const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
//   const location = useLocation();
//   const isMapPage = location.pathname === '/';

//   const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

//   const handleNotificationClick = () => {
//     console.log('Notification clicked - opening notification panel');
//   };

//   const handleTabChange = (tab: 'home' | 'profile') => {
//     setActiveTab(tab);
//     console.log('Tab changed to:', tab);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-[#2F4939] dark:bg-[#1e1e1b] text-gray-900 dark:text-gray-100">
//       {/* Top Navigation */}
//       <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0 relative z-40`}>
//         <EnhancedNavigation onNotificationClick={handleNotificationClick} />
//       </div>

//       {/* Main Content */}
//       <main className={`flex-1 relative ${isMapPage ? 'h-full md:h-full' : ''}`}>
//       <main className={`flex-1 relative ${isMapPage ? 'h-[100dvh] md:h-full' : ''}`}>
//         {/* <div className={`w-[350px] ${isMapPage ? 'h-full pb-20 md:pb-0' : 'min-h-full'}`} > */}
//         <div className={`${isMapPage ? 'w-full h-[100dvh] pb-20 md:pb-0' : 'w-[350px] min-h-full'}`}>
//           {children}
//         </div>
//       </main>

//       {/* Bottom Navigation (Mobile Only) */}
//       {isMapPage && (
//         <div className="md:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
//           <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthenticatedLayout;
// src/layouts/AuthenticatedLayout.tsx


// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
// import BottomTabBar from '@/components/navigation/BottomTabBar';
// import OSMTreeMap from '@/components/map/OSMTreeMap'; // Assuming this is your main map component
// interface AuthenticatedLayoutProps {
//   children: React.ReactNode;
// }

// const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'explore' | 'favorites'>('home');

//   const isMapPage = location.pathname === '/';
//   const [showSettings, setShowSettings] = useState(false);
//   const [isSatelliteView, setIsSatelliteView] = useState(false); // Added state for satellite view

//   useEffect(() => {
//     if (location.pathname === '/') setActiveTab('home');
//     else if (location.pathname.includes('/profile')) setActiveTab('profile');
//     else if (location.pathname.includes('/explore')) setActiveTab('explore');
//   }, [location.pathname]);

//   const handleNotificationClick = () => {
//     console.log('Notification clicked - opening notification panel');
//   };

//   const handleTabChange = (tab: 'home' | 'profile' | 'explore' | 'favorites') => {
//     setActiveTab(tab);
//     if (tab === 'home') navigate('/');
//     else if (tab === 'profile') navigate('/profile');
//     else if (tab === 'explore') navigate('/explore');
//     else if (tab === 'favorites') navigate('/favorites');
//   };

//   return (
//     <div className="flex flex-1 flex-row bg-[#2F4939] dark:bg-[#1e1e1b] text-gray-900 dark:text-gray-100">
//       {/* Top Navigation */}
//       {/* <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0 relative z-40`}>

//         <EnhancedNavigation onNotificationClick={handleNotificationClick} />
//       </div> */}
//       {/*side bar*/}


//       {/* Main Content */}
//       {/* <main className={`flex-1 relative ${isMapPage ? 'h-full md:h-full' : ''}`}> */}
//        {/* <main className={`flex-1 relative ${isMapPage ? 'h-full md:h-full' : ''}`}> */}
//        <main className={`flex-1 relative ${isMapPage ? 'h-[100dvh] md:h-full' : ''}`}>
//          {/* <div className={`w-[350px] ${isMapPage ? 'h-full pb-20 md:pb-0' : 'min-h-full'}`} > */}
//          <div className={`${isMapPage ? 'w-full h-[100dvh] pb-20 md:pb-0' : 'w-[350px] min-h-full'}`}>
//            {children}
//          </div>
//        </main>

//       {/* Bottom Navigation (Mobile Only) */}
//       <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
//     </div>
//   );
// };

// export default AuthenticatedLayout;

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import BottomTabBar from '@/components/navigation/BottomTabBar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'explore' | 'favorites'>('home');

  // Detect if we're on the home/map page
  const isMapPage = location.pathname === '/';

  useEffect(() => {
    if (location.pathname === '/') setActiveTab('home');
    else if (location.pathname.includes('/profile')) setActiveTab('profile');
    else if (location.pathname.includes('/explore')) setActiveTab('explore');
    else if (location.pathname.includes('/favorites')) setActiveTab('favorites');
  }, [location.pathname]);

  const handleNotificationClick = () => {
    // You can open a notification panel here
    console.log('Notification clicked - opening notification panel');
  };

  const handleTabChange = (tab: 'home' | 'profile' | 'explore' | 'favorites') => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/');
    else if (tab === 'profile') navigate('/profile');
    else if (tab === 'explore') navigate('/explore');
    else if (tab === 'favorites') navigate('/favorites');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#2F4939] dark:bg-[#1e1e1b] text-gray-900 dark:text-gray-100 ">
      {/* Top Navigation */}
      {/* <div className={`${isMapPage ? 'hidden md:block' : 'block'} flex-shrink-0 relative z-40`}>
        <EnhancedNavigation onNotificationClick={handleNotificationClick} />
      </div> */}

      {/* Main Content: let children handle their own layout */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;