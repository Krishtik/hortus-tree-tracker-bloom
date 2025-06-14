
import { Button } from '@/components/ui/button';

interface SatelliteToggleProps {
  isSatelliteView: boolean;
  onToggle: () => void;
}

const SatelliteToggle = ({ isSatelliteView, onToggle }: SatelliteToggleProps) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        onClick={onToggle}
        variant={isSatelliteView ? "default" : "outline"}
        size="sm"
        className="bg-white/90 backdrop-blur-sm hover:bg-white"
      >
        {isSatelliteView ? "Street View" : "Satellite"}
      </Button>
    </div>
  );
};

export default SatelliteToggle;
