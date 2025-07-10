// import React from 'react';
// import logo from '@/assets/logo.png'; // Replace with your logo path
// import { useAuth } from '@/contexts/AuthContext'; // Adjust import as needed

// const HomeTopBar = () => {
//   const { user } = useAuth(); // Or however you get user info

//   return (
//     <div className="flex flex-row items-center h-20 bg-[#C2A600] px-8 rounded-tl-[40px]">
//       <div className="w-14 h-14 rounded-full bg-[#188B6A] flex items-center justify-center mr-6">
//         <img src={logo} alt="Company" className="w-8 h-8" />
//       </div>
//       <div className="flex-1" />
//       {/* <div className="w-12 h-12 rounded-full border-4 border-white overflow-hidden">
//         <img src={user?.profilePicture || '/default-profile.png'} alt="Profile" className="w-full h-full object-cover" />
//       </div> */}
//     </div>
//   );
// };

// export default HomeTopBar;


import { useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon, SparklesIcon} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button';
import { Bell, Plus, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import '@/components/HomeScreenCSS/HomeScreen.css'; // Assuming you have a CSS file for styles
import { TreeDeciduous } from 'lucide-react';

interface HomeTopBarProps {
  onNotificationClick: () => void;
  activeTab?: 'home' | 'scan' | 'log' | 'profile';
  onTabChange?: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
  unreadNotifications?: number;
  onLogPlantClick?: () => void;
}

const HomeTopBar = ({ 
  // onNotificationClick, 
  // activeTab = 'home',
  // onTabChange,
  // unreadNotifications = 0,
  onLogPlantClick
}: HomeTopBarProps) => {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
  // <nav className="bg-gradient-to-r from-emerald-100 via-green-50 to-lime-100 dark:from-emerald-900 dark:via-green-950 dark:to-lime-900 backdrop-blur-xl border-b border-green-200/50 dark:border-green-800/50 shadow-sm transition-all duration-300 sticky top-0 z-40">
  <nav className="navbar">
  {/* <nav className="bg-gradient-to-r from-darkgreen-100 via-green-50 to-amber-100 dark:from-pink-900 dark:via-rose-950 dark:to-amber-900 backdrop-blur-xl border-b border-rose-200/50 dark:border-rose-800/50 shadow-sm transition-all duration-300 sticky top-0 z-40"> */}

      <div className="max-w-7.6xl mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="flex justify-between items-center h-14">

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="nav-icon">
                <span><TreeDeciduous className="h-4 w-4 text-sunshine" /></span>
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold bg-[#88976d] dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                Krish Hortus
              </h1>
              <p className="text-[10px] text-sunshine dark:text-gray-800 font-small hidden sm:block">
                AI Tree Mapping Platform
              </p>
            </div>
          </div>

          {/* Right Side Actions with improved spacing and styling */}
          <div className="flex items-center space-x-3">
            {/* Log Plant Button with enhanced design */}
            {onLogPlantClick && (
              <Button
                onClick={onLogPlantClick}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl px-4 py-2"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Log Plant</span>
                <span className="sm:hidden">Log</span>
              </Button>
            )}

            {/* User Info with better typography */}
            {user && (
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[14px] font-medium text-[#88976d] dark:text-[#A9A9A9]">
                  {user.name || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-sunshine dark:text-gray-400">
                  Tree Mapper
                </span>
              </div>
            )}

            {/* Theme Toggle with enhanced styling */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-forest dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 w-10 h-10 p-0 rounded-full shadow-sm"
                >
                  <span className="flex items-center justify-center">
                    {theme === 'dark' ? <MoonIcon className="h-4 w-4"/> : <SunIcon className="h-4 w-4"/>}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl rounded-xl" align="end">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  <SunIcon className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  <MoonIcon className="h-4 w-4 mr-2"/>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  <ComputerDesktopIcon className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications with enhanced design */}
            {/* <Button
              variant="outline"
              size="sm"
              onClick={onNotificationClick}
              className="relative border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 w-10 h-10 p-0 rounded-xl shadow-sm"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white dark:border-gray-950 rounded-full shadow-lg animate-pulse"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button> */}

            {/* Logout Button with enhanced styling */}
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 rounded-xl shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeTopBar;
