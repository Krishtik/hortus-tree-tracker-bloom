
import { Camera, TreePine, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  activeTab: 'home' | 'scan' | 'log' | 'profile';
  onTabChange: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home' as const, label: 'Map', icon: TreePine, gradient: 'from-emerald-500 to-green-500' },
    { id: 'scan' as const, label: 'Scan', icon: Camera, gradient: 'from-orange-500 to-red-500' },
    { id: 'log' as const, label: 'Trees', icon: FileText, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'profile' as const, label: 'Profile', icon: User, gradient: 'from-blue-500 to-indigo-500' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 z-50 transition-all duration-300">
      <div className="grid grid-cols-4 h-20 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full rounded-none space-y-1 transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg` 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-lg"></div>
              )}
              <Icon className={`h-6 w-6 transition-all duration-300 ${
                isActive 
                  ? 'text-white transform scale-110' 
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
