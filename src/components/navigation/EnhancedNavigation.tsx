
import { useState } from 'react';
import { Bell, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedNavigationProps {
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}

const EnhancedNavigation = ({ onNotificationClick, onSettingsClick }: EnhancedNavigationProps) => {
  const [notificationCount] = useState(3); // Mock notification count
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full p-4 bg-background border-b md:hidden">
      {/* Left: App Name */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Krish Hortus
        </h1>
      </div>

      {/* Right: Notifications and Settings */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={onNotificationClick}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Settings with Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              App Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EnhancedNavigation;
