
import { Settings, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onSettingsClick: () => void;
  onLocateClick: () => void;
  isLocating: boolean;
}

const MapControls = ({ onSettingsClick, onLocateClick, isLocating }: MapControlsProps) => {
  return (
    <>
      {/* Locate User FAB - Right bottom */}
      <Button
        onClick={onLocateClick}
        size="sm"
        variant="outline"
        disabled={isLocating}
        className="fixed bottom-6 right-6 z-20 w-14 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900"
      >
        {isLocating ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
        ) : (
          <Locate className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </Button>

      {/* Settings FAB - Top left */}
      <Button
        onClick={onSettingsClick}
        size="sm"
        variant="outline"
        className="fixed top-24 left-6 z-20 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900"
      >
        <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </Button>
    </>
  );
};

export default MapControls;
