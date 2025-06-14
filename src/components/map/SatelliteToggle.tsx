
import { Button } from '@/components/ui/button';

interface SatelliteToggleProps {
  isSatelliteView: boolean;
  onToggle: () => void;
}

const SatelliteToggle = ({ isSatelliteView, onToggle }: SatelliteToggleProps) => {
  return (
    <div className="absolute top-4 right-20 z-10 md:top-6 md:right-24">
      <Button
        onClick={onToggle}
        variant={isSatelliteView ? "default" : "outline"}
        size="sm"
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-600"
      >
        {isSatelliteView ? "🗺️ Street" : "🛰️ Satellite"}
      </Button>
    </div>
  );
};

export default SatelliteToggle;
