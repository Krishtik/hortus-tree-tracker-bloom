
import { useState } from 'react';
import { TreePine, User, FileText, Info, Home, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

interface ModernTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    color: 'text-blue-600', 
    gradient: 'from-blue-500 to-indigo-500' 
  },
  { 
    id: 'trees', 
    label: 'Trees', 
    icon: TreePine, 
    color: 'text-green-600', 
    gradient: 'from-green-500 to-emerald-500' 
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    color: 'text-purple-600', 
    gradient: 'from-purple-500 to-violet-500' 
  },
  { 
    id: 'logs', 
    label: 'Logs', 
    icon: FileText, 
    color: 'text-orange-600', 
    gradient: 'from-orange-500 to-red-500' 
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: User, 
    color: 'text-indigo-600', 
    gradient: 'from-indigo-500 to-blue-500' 
  },
  { 
    id: 'about', 
    label: 'About', 
    icon: Info, 
    color: 'text-gray-600', 
    gradient: 'from-gray-500 to-slate-500' 
  }
];

const ModernTabNavigation = ({ activeTab, onTabChange }: ModernTabNavigationProps) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 py-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">🌳</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                Krish Hortus
              </h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => onTabChange(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative px-4 py-2 h-auto flex flex-col items-center space-y-1 transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg` 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? 'text-white' : tab.color
                  }`} />
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white opacity-80"></div>
                  )}
                  
                  {isHovered && !isActive && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r ${tab.gradient} opacity-60 animate-scale-in`}></div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTabNavigation;
