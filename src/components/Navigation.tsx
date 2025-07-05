import React from 'react';
import { TreePine, User, Home, Sparkles } from 'lucide-react'; // Added Home and Sparkles for more options
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button

interface BottomTabBarProps {
  activeTab: 'home' | 'profile' | 'explore' | 'favorites'; // Extended for more tabs
  onTabChange: (tab: 'home' | 'profile' | 'explore' | 'favorites') => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const tabs = [
    {
      id: 'home' as const,
      label: 'Map',
      icon: Home, // Changed to Home icon for broader 'map/dashboard' sense
      gradient: 'from-emerald-500 to-green-600', // Stronger gradient for active
      iconColor: 'text-emerald-700 dark:text-emerald-300', // Default icon color
      activeTextColor: 'text-white', // Active tab text color
      activeIconColor: 'text-white', // Active tab icon color
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      gradient: 'from-blue-500 to-indigo-600', // Distinct gradient
      iconColor: 'text-blue-700 dark:text-blue-300',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
    // Adding more tabs for a more robust example
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: Sparkles, // Placeholder for explore feature
      gradient: 'from-yellow-500 to-orange-600',
      iconColor: 'text-yellow-700 dark:text-yellow-300',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
    // {
    //   id: 'favorites' as const,
    //   label: 'Saved',
    //   icon: Heart, // Example for favorites
    //   gradient: 'from-red-500 to-pink-600',
    //   iconColor: 'text-red-700 dark:text-red-300',
    //   activeTextColor: 'text-white',
    //   activeIconColor: 'text-white',
    // },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl">
      <nav className="flex items-center justify-around max-w-lg mx-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant="ghost" // Always use ghost for base, apply styles conditionally
              size="lg" // Larger tappable area
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined} // Accessibility
              aria-label={`Switch to ${tab.label} view`}
              className={`
                relative flex flex-col items-center justify-center flex-1 mx-1
                group transition-all duration-300 ease-in-out transform
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                rounded-xl p-2 h-auto focus-visible:ring-offset-0
                ${isActive ? 'font-semibold' : ''}
              `}
            >
              {/* Active Indicator (Subtle "leaf" or "underline" effect) */}
              {isActive && (
                <div
                  className={`absolute top-0 w-2/3 h-1 rounded-b-lg bg-gradient-to-r ${tab.gradient}
                    transform transition-all duration-300 ease-out -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                    md:group-hover:translate-y-0 md:group-hover:opacity-100
                  `}
                ></div>
              )}

              <div className={`
                  flex items-center justify-center w-full h-full p-2 rounded-lg transition-all duration-300 ease-in-out
                  ${isActive
                    ? `bg-gradient-to-br ${tab.gradient} text-white shadow-md scale-105`
                    : `text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200`
                  }
              `}>
                <Icon
                  className={`h-6 w-6 transition-colors duration-300
                    ${isActive ? tab.activeIconColor : tab.iconColor}
                  `}
                />
              </div>
              <span
                className={`text-xs mt-1 transition-colors duration-300
                  ${isActive ? tab.activeTextColor : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'}
                `}
              >
                {tab.label}
              </span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomTabBar;