
import { FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomTabBarProps {
  activeTab: 'home' | 'scan' | 'log' | 'profile';
  onTabChange: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  return (
    <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-10 md:bottom-8">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-600">
        <Button
          variant={activeTab === 'log' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('log')}
          className={`rounded-full transition-all duration-200 ${
            activeTab === 'log' 
              ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
          }`}
        >
          <FileText className="h-4 w-4 mr-2" />
          Trees
        </Button>
        
        <Button
          variant={activeTab === 'profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('profile')}
          className={`rounded-full transition-all duration-200 ${
            activeTab === 'profile' 
              ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
          }`}
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </div>
    </div>
  );
};

export default BottomTabBar;
