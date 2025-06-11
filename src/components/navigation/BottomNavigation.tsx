
import { Camera, TreePine, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  activeTab: 'home' | 'scan' | 'log' | 'profile';
  onTabChange: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home' as const, label: 'Map', icon: TreePine },
    { id: 'scan' as const, label: 'Scan', icon: Camera },
    { id: 'log' as const, label: 'Trees', icon: FileText },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors duration-200">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full rounded-none space-y-1 transition-all duration-200 ${
                isActive 
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-green-600 dark:text-green-400' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-green-600 dark:text-green-400' : ''}`}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
