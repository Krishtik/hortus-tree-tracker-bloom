
import { Home, Camera, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: 'home' | 'scan' | 'log' | 'profile';
  onTabChange: (tab: 'home' | 'scan' | 'log' | 'profile') => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'scan', icon: Camera, label: 'Scan Tree' },
    { id: 'log', icon: FileText, label: 'Tree Log' },
    { id: 'profile', icon: User, label: 'Profile' }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
              activeTab === id
                ? "text-green-600 bg-green-50"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
