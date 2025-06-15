
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, LogOut, Plus } from 'lucide-react';

/**
 * Props interface for Navigation component
 */
interface NavigationProps {
  /** Callback function triggered when authentication button is clicked */
  onAuthClick: () => void;
  /** Callback function triggered when log plant button is clicked */
  onLogPlantClick: () => void;
}

/**
 * Top navigation component for the application
 * Provides branding, user actions, and responsive design
 * Adapts content based on user authentication status
 * 
 * Features:
 * - Responsive design with backdrop blur effect
 * - Dynamic content based on authentication state
 * - Gradient text branding
 * - User greeting and logout functionality
 * - Plant logging quick action for authenticated users
 */
const Navigation = ({ onAuthClick, onLogPlantClick }: NavigationProps) => {
  const { isAuthenticated, logout, user } = useAuth();

  /**
   * Handles user logout with proper cleanup
   * Calls the logout function from auth context
   */
  const handleLogout = () => {
    console.log('User logout initiated');
    logout();
  };

  /**
   * Handles plant logging action
   * Triggers the callback for plant logging functionality
   */
  const handleLogPlant = () => {
    console.log('Plant logging action triggered');
    onLogPlantClick();
  };

  /**
   * Handles authentication button click
   * Triggers the callback to open authentication modal
   */
  const handleAuthClick = () => {
    console.log('Authentication button clicked');
    onAuthClick();
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Brand Section with Logo and App Name */}
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400 animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Krish Hortus
            </span>
          </div>

          {/* Action Section - Content changes based on authentication state */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated User Interface
              <>
                {/* Quick Plant Logging Action */}
                <Button
                  onClick={handleLogPlant}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log Plant
                </Button>
                
                {/* User Greeting */}
                <div className="text-sm text-muted-foreground hidden sm:block">
                  Welcome, {user?.name || user?.email}
                </div>
                
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              // Guest User Interface
              <Button
                onClick={handleAuthClick}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In / Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
