
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, FileText, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
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
}

const EnhancedNavigation = ({ 
  onNotificationClick, 
  activeTab = 'home',
  onTabChange,
  unreadNotifications = 0
}: EnhancedNavigationProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-background border-b border-border shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Krish Hortus
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI Tree Mapping Platform
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange?.('home')}
              className="text-sm"
            >
              Map
            </Button>
            <Button
              variant={activeTab === 'log' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange?.('log')}
              className="text-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Tree Log
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange?.('profile')}
              className="text-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border text-foreground hover:bg-accent"
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
                  className="text-foreground hover:bg-accent"
                >
                  ☀️ Light Mode
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="text-foreground hover:bg-accent"
                >
                  🌙 Dark Mode
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="text-foreground hover:bg-accent"
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
              className="relative border-border text-foreground hover:bg-accent"
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;
