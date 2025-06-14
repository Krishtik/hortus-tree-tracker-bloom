
import { TreePine, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomTabBarProps {
  activeTab: 'home' | 'profile';
  onTabChange: (tab: 'home' | 'profile') => void;
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
      id: 'profile' as const, 
      label: 'Profile', 
      icon: User, 
      gradient: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
    }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 p-2">
      <div className="flex items-center justify-center max-w-sm mx-auto">
        <div className="flex items-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl px-2 py-2 shadow-lg border border-gray-200/50 dark:border-gray-800/50">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <div key={tab.id} className="flex items-center">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`rounded-xl transition-all duration-300 transform hover:scale-105 px-6 py-2 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg hover:opacity-90` 
                      : `text-gray-600 dark:text-gray-400 ${tab.hoverColor}`
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </Button>
                {index < tabs.length - 1 && (
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-3"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomTabBar;
