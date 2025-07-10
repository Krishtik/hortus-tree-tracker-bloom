// import React from 'react';
// import { TreePine, User, Home, Sparkles } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// interface BottomTabBarProps {
//   activeTab: 'home' | 'profile' | 'explore' | 'favorites';
//   onTabChange: (tab: 'home' | 'profile' | 'explore' | 'favorites') => void;
// }

// const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
//   const tabs = [
//     {
//       id: 'home' as const,
//       label: 'Map',
//       icon: Home,
//       gradient: 'from-emerald-500 to-green-600',
//       iconColor: 'text-emerald-700 dark:text-emerald-300',
//       activeTextColor: 'text-white',
//       activeIconColor: 'text-white',
//     },
//     {
//       id: 'profile' as const,
//       label: 'Profile',
//       icon: User,
//       gradient: 'from-blue-500 to-indigo-600',
//       iconColor: 'text-blue-700 dark:text-blue-300',
//       activeTextColor: 'text-white',
//       activeIconColor: 'text-white',
//     },
//     {
//       id: 'explore' as const,
//       label: 'Explore',
//       icon: Sparkles,
//       gradient: 'from-yellow-500 to-orange-600',
//       iconColor: 'text-yellow-700 dark:text-yellow-300',
//       activeTextColor: 'text-white',
//       activeIconColor: 'text-white',
//     },
//   ];

//   return (
//     // **CHANGED: Added responsive classes here**
//     // flex: makes it a flex container by default (mobile)
//     // md:hidden: hides it from the 'md' breakpoint and larger
//     <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl
//                 flex md:hidden"> {/* <-- ADDED THIS LINE */}
//       <nav className="flex items-center justify-around max-w-lg mx-auto py-2 w-full"> {/* Added w-full for full width on mobile */}
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;

//           return (
//             <Button
//               key={tab.id}
//               variant="ghost"
//               size="lg"
//               onClick={() => onTabChange(tab.id)}
//               aria-current={isActive ? 'page' : undefined}
//               aria-label={`Switch to ${tab.label} view`}
//               className={`
//                 relative flex flex-col items-center justify-center flex-1 mx-1
//                 group transition-all duration-300 ease-in-out transform
//                 text-gray-600 dark:text-gray-400
//                 hover:bg-gray-100 dark:hover:bg-gray-800
//                 rounded-xl p-2 h-auto focus-visible:ring-offset-0
//                 ${isActive ? 'font-semibold' : ''}
//               `}
//             >
//               {isActive && (
//                 <div
//                   className={`absolute top-0 w-2/3 h-1 rounded-b-lg bg-gradient-to-r ${tab.gradient}
//                     transform transition-all duration-300 ease-out -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100
//                     md:group-hover:translate-y-0 md:group-hover:opacity-100
//                   `}
//                 ></div>
//               )}

//               <div className={`
//                   flex items-center justify-center w-full h-full p-2 rounded-lg transition-all duration-300 ease-in-out
//                   ${isActive
//                     ? `bg-gradient-to-br ${tab.gradient} text-white shadow-md scale-105`
//                     : `text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200`
//                   }
//               `}>
//                 <Icon
//                   className={`h-6 w-6 transition-colors duration-300
//                     ${isActive ? tab.activeIconColor : tab.iconColor}
//                   `}
//                 />
//               </div>
//               <span
//                 className={`text-xs mt-1 transition-colors duration-300
//                   ${isActive ? tab.activeTextColor : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'}
//                 `}
//               >
//                 {tab.label}
//               </span>
//             </Button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// export default BottomTabBar;

// src/components/navigation/BottomTabBar.tsx
import React from 'react';
import { TreePine, User, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomTabBarProps {
  activeTab: 'home' | 'profile' | 'explore' | 'favorites';
  onTabChange: (tab: 'home' | 'profile' | 'explore' | 'favorites') => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const tabs = [
    {
      id: 'home' as const,
      label: 'Map',
      icon: Home,
      gradient: 'from-emerald-500 to-green-600',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: Sparkles,
      gradient: 'from-yellow-500 to-orange-600',
      iconColor: 'text-yellow-700 dark:text-yellow-300',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      gradient: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-700 dark:text-blue-300',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-950/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl flex md:hidden">
      <nav className="flex items-center justify-around w-full py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="lg"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Switch to ${tab.label} view`}
              className={`
                relative flex flex-col items-center justify-center flex-1
                group transition-all duration-300 ease-in-out transform
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                rounded-xl p-2 h-auto focus-visible:ring-offset-0
                ${isActive ? 'font-semibold' : ''}
              `}
            >
              {isActive && (
                <div
                  className={`absolute top-0 w-2/3 h-1 rounded-b-lg bg-gradient-to-r ${tab.gradient}
                    transform transition-all duration-300 ease-out -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
                ></div>
              )}

              <div className={`flex items-center justify-center w-full h-full p-2 rounded-lg transition-all duration-300 ease-in-out
                  ${isActive
                    ? `bg-gradient-to-br ${tab.gradient} text-white shadow-md scale-105`
                    : `text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200`
                  }`}>
                <Icon className={`h-6 w-6 transition-colors duration-300 ${isActive ? tab.activeIconColor : tab.iconColor}`} />
              </div>
              <span className={`text-xs mt-1 transition-colors duration-300
                ${isActive ? tab.activeTextColor : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'}`}>
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