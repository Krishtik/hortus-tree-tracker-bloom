
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
      {/* Camera FAB - left bottom with proper spacing */}
      <Button
        onClick={onCameraClick}
        size="lg"
        className="fixed bottom-28 left-4 z-10 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-200 hover:scale-105 dark:bg-green-700 dark:hover:bg-green-800 md:bottom-20 md:left-6"
      >
        <Camera className="h-6 w-6 text-white" />
      </Button>

      {/* Locate User FAB - right bottom with proper spacing */}
      <Button
        onClick={onLocateClick}
        size="sm"
        variant="outline"
        disabled={isLocating}
        className="fixed bottom-28 right-4 z-10 rounded-full w-12 h-12 bg-white dark:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 md:bottom-20 md:right-6 border border-gray-200 dark:border-gray-600"
      >
        {isLocating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
        ) : (
          <Locate className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        )}
      </Button>

      {/* Settings FAB - positioned to avoid overlap */}
      <Button
        onClick={onSettingsClick}
        size="sm"
        variant="outline"
        className="fixed top-20 left-4 z-10 rounded-full w-10 h-10 bg-white dark:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 md:top-20 md:left-6 border border-gray-200 dark:border-gray-600"
      >
        <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </Button>
    </>
  );
};

export default MapControls;
