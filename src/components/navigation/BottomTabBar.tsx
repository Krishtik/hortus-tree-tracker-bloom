
import { TreePine, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomTabBarProps {
  activeTab: 'home' | 'log' | 'profile';
  onTabChange: (tab: 'home' | 'log' | 'profile') => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const tabs = [
    { 
      id: 'home' as const, 
      label: 'Map', 
      icon: TreePine, 
      gradient: 'from-emerald-500 to-green-500',
      hoverColor: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
    },
    { 
      id: 'log' as const, 
      label: 'Log', 
      icon: FileText, 
      gradient: 'from-blue-500 to-indigo-500',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      id: 'profile' as const, 
      label: 'Profile', 
      icon: User, 
      gradient: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
    }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-sm">
      <div className="flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl border border-gray-200/50 dark:border-gray-800/50">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <div key={tab.id} className="flex items-center">
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`rounded-xl transition-all duration-300 transform hover:scale-105 px-4 py-2 ${
                  isActive 
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg hover:opacity-90` 
                    : `text-gray-600 dark:text-gray-400 ${tab.hoverColor}`
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="font-medium text-sm">{tab.label}</span>
              </Button>
              {index < tabs.length - 1 && (
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;
