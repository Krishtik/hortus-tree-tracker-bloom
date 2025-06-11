
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { bell, Settings, chevron-down } from 'lucide-react';
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
  onSettingsClick: () => void;
}

const EnhancedNavigation = ({ onNotificationClick, onSettingsClick }: EnhancedNavigationProps) => {
  const { theme, setTheme } = useTheme();
  const [unreadNotifications] = useState(3);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
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
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  AI Tree Mapping Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span className="text-sm">
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </span>
                  <chevron-down className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  ☀️ Light Mode
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  🌙 Dark Mode
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
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
              className="relative dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white dark:border-gray-900"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;
