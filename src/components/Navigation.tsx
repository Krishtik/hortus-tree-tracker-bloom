
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
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Krish Hortus
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={onLogPlantClick}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
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
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
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
