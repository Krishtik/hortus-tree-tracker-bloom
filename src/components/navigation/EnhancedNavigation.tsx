
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Plus, LogOut, Palette } from 'lucide-react';
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

interface EnhancedNavigationProps {
  onNotificationClick: () => void;
  activeTab?: 'home' | 'scan' | 'log' | 'profile';
  onTabChange?: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
  unreadNotifications?: number;
  onLogPlantClick?: () => void;
}

const EnhancedNavigation = ({ 
  onNotificationClick, 
  activeTab = 'home',
  onTabChange,
  unreadNotifications = 0,
  onLogPlantClick
}: EnhancedNavigationProps) => {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Branding with enhanced styling */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">🌳</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                Krish Hortus
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name || user.email?.split('@')[0]}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
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
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 w-10 h-10 p-0 rounded-xl shadow-sm"
                >
                  <span className="text-lg">
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl rounded-xl" align="end">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  ☀️ Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  🌙 Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  💻 System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications with enhanced design */}
            <Button
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
            </Button>

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

export default EnhancedNavigation;
