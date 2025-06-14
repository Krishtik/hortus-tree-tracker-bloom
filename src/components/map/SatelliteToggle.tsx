
import { Button } from '@/components/ui/button';
import { Map, Satellite } from 'lucide-react';

interface SatelliteToggleProps {
  isSatelliteView: boolean;
  onToggle: () => void;
}

const SatelliteToggle = ({ isSatelliteView, onToggle }: SatelliteToggleProps) => {
  return (
    <div className="absolute top-6 right-6 z-20">
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className={`w-12 h-12 backdrop-blur-xl shadow-xl border transition-all duration-300 hover:scale-105 rounded-2xl group ${
          isSatelliteView 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-300/50 hover:from-blue-600 hover:to-indigo-600 shadow-blue-200/50' 
            : 'bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        {isSatelliteView ? (
          <Map className="h-4 w-4" />
        ) : (
          <Satellite className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default SatelliteToggle;
