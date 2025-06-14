
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, LogOut, Plus } from 'lucide-react';

interface NavigationProps {
  onAuthClick: () => void;
  onLogPlantClick: () => void;
}

const Navigation = ({ onAuthClick, onLogPlantClick }: NavigationProps) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Krish Hortus
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={onLogPlantClick}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log Plant
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Welcome, {user?.name || user?.email}
                </div>
                
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-200"
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
