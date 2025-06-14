
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, LogOut, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
    <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo and Branding - Made more compact */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌳</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Krish Hortus
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI Tree Mapping Platform
              </p>
            </div>
          </div>

          {/* Right Side Actions - Streamlined */}
          <div className="flex items-center space-x-2">
            {/* Log Plant Button */}
            {onLogPlantClick && (
              <Button
                onClick={onLogPlantClick}
                variant="outline"
                size="sm"
                className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Log Plant</span>
              </Button>
            )}

            {/* User Info - Compact */}
            {user && (
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300 max-w-32 truncate">
                {user.name || user.email?.split('@')[0]}
              </div>
            )}

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-9 h-9 p-0"
                >
                  <span className="text-sm">
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border" align="end">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="text-foreground hover:bg-accent focus:bg-accent transition-colors duration-200"
                >
                  ☀️ Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="text-foreground hover:bg-accent focus:bg-accent transition-colors duration-200"
                >
                  🌙 Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="text-foreground hover:bg-accent focus:bg-accent transition-colors duration-200"
                >
                  💻 System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button
              variant="outline"
              size="sm"
              onClick={onNotificationClick}
              className="relative border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-9 h-9 p-0"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white border border-background"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;
