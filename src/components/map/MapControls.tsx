
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
      {/* Locate User FAB - Modern floating design */}
      <Button
        onClick={onLocateClick}
        size="sm"
        variant="outline"
        disabled={isLocating}
        className="fixed bottom-28 right-6 z-50 w-14 h-14 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border border-emerald-200/50 dark:border-emerald-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl group"
      >
        {isLocating ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
        ) : (
          <Locate className="h-5 w-5 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors" />
        )}
      </Button>

      {/* Settings FAB - Modern floating design */}
      {/* <Button
        onClick={onSettingsClick}
        size="sm"
        variant="outline"
      className="fixed bottom-60 right-6 z-50 w-14 h-14 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border border-emerald-200/50 dark:border-emerald-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl group" 
      >
        <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      </Button> */}
    </>
  );
};

export default MapControls;
