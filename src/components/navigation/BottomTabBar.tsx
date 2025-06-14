
import { FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomTabBarProps {
  activeTab: 'home' | 'scan' | 'log' | 'profile';
  onTabChange: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex items-center space-x-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-gray-200/50 dark:border-gray-800/50">
        <Button
          variant={activeTab === 'log' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('log')}
          className={`rounded-xl transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'log' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:from-emerald-600 hover:to-green-600' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
        >
          <FileText className="h-4 w-4 mr-2" />
          <span className="font-medium">Trees</span>
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        
        <Button
          variant={activeTab === 'profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('profile')}
          className={`rounded-xl transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'profile' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:from-blue-600 hover:to-indigo-600' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <User className="h-4 w-4 mr-2" />
          <span className="font-medium">Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomTabBar;
