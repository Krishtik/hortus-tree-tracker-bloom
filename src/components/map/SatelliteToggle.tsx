
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
      className="fixed bottom-45 right-6 z-50 w-14 h-14 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border border-emerald-200/50 dark:border-emerald-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full group" 
      title={isSatelliteView ? 'Switch to Satellite View' : 'Switch to Street View'}
    >
      {isSatelliteView ? (
        <Map className="h-8 w-8 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      ) : (
        <Satellite className="h-8 w-8 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      )}
    </Button>
  );
};

export default SatelliteToggle;
