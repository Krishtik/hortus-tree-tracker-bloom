
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapUpdaterProps {
  center: [number, number] | null;
}

// Component to handle map updates with smooth animation
const MapUpdater = ({ center }: MapUpdaterProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
};

export default MapUpdater;
