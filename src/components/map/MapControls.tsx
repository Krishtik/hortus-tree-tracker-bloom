
import { Camera, Settings, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onCameraClick: () => void;
  onSettingsClick: () => void;
  onLocateClick: () => void;
  isLocating: boolean;
}

const MapControls = ({ onCameraClick, onSettingsClick, onLocateClick, isLocating }: MapControlsProps) => {
  return (
    <>
      {/* Camera FAB - Enhanced with glass morphism */}
      <Button
        onClick={onCameraClick}
        size="lg"
        className="fixed bottom-6 left-6 z-20 rounded-2xl w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-2xl transition-all duration-300 hover:scale-110 transform border-2 border-white/20"
      >
        <Camera className="h-7 w-7 text-white drop-shadow-lg" />
      </Button>

      {/* Locate User FAB - Enhanced styling */}
      <Button
        onClick={onLocateClick}
        size="sm"
        variant="outline"
        disabled={isLocating}
        className="fixed bottom-6 right-6 z-20 rounded-2xl w-14 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900"
      >
        {isLocating ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
        ) : (
          <Locate className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </Button>

      {/* Settings FAB - Enhanced positioning and styling */}
      <Button
        onClick={onSettingsClick}
        size="sm"
        variant="outline"
        className="fixed top-24 left-6 z-20 rounded-2xl w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900"
      >
        <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </Button>
    </>
  );
};

export default MapControls;
