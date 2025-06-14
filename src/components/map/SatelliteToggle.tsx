
import { Button } from '@/components/ui/button';

interface SatelliteToggleProps {
  isSatelliteView: boolean;
  onToggle: () => void;
}

const SatelliteToggle = ({ isSatelliteView, onToggle }: SatelliteToggleProps) => {
  return (
    <div className="absolute top-24 right-6 z-20">
      <Button
        onClick={onToggle}
        variant={isSatelliteView ? "default" : "outline"}
        size="sm"
        className={`rounded-2xl h-12 px-4 backdrop-blur-xl shadow-xl border-2 transition-all duration-300 hover:scale-105 ${
          isSatelliteView 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-white/20 hover:from-blue-600 hover:to-indigo-600' 
            : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900'
        }`}
      >
        <span className="font-medium">
          {isSatelliteView ? "🗺️ Street" : "🛰️ Satellite"}
        </span>
      </Button>
    </div>
  );
};

export default SatelliteToggle;
