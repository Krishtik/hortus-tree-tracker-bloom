
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, FileText, User, TreePine, LogOut, Plus } from 'lucide-react';
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
        <div className="flex justify-between items-center h-16">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Krish Hortus
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI Tree Mapping Platform
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Improved colors */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange?.('home')}
              className={`text-sm transition-colors duration-200 ${
                activeTab === 'home' 
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <TreePine className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant={activeTab === 'log' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange?.('log')}
              className={`text-sm transition-colors duration-200 ${
                activeTab === 'log' 
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Tree Log
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange?.('profile')}
              className={`text-sm transition-colors duration-200 ${
                activeTab === 'profile' 
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Log Plant Button - Desktop */}
            {onLogPlantClick && (
              <Button
                onClick={onLogPlantClick}
                variant="outline"
                size="sm"
                className="hidden md:flex border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Plant
              </Button>
            )}

            {/* User Info - Desktop */}
            {user && (
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.name || user.email}
              </div>
            )}

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <span className="text-sm">
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="text-foreground hover:bg-accent focus:bg-accent transition-colors duration-200"
                >
                  ☀️ Light Mode
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="text-foreground hover:bg-accent focus:bg-accent transition-colors duration-200"
                >
                  🌙 Dark Mode
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
              className="relative border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-background"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Logout Button - Desktop */}
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="hidden md:flex border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;
