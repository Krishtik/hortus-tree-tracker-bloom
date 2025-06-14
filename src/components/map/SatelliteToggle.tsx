
import { Satellite, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SatelliteToggleProps {
  isSatelliteView: boolean;
  onToggle: () => void;
}

const SatelliteToggle = ({ isSatelliteView, onToggle }: SatelliteToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      size="sm"
      variant="outline"
      className="fixed top-20 right-4 z-30 w-12 h-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl group sm:top-6 sm:right-20"
      title={isSatelliteView ? 'Switch to Street View' : 'Switch to Satellite View'}
    >
      {isSatelliteView ? (
        <Map className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      ) : (
        <Satellite className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      )}
    </Button>
  );
};

export default SatelliteToggle;
