
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapUpdaterProps {
  center: [number, number] | null;
  mapInstance?: any;
  setMapInstance?: (map: any) => void;
}

// Component to handle map updates with smooth animation
const MapUpdater = ({ center, mapInstance, setMapInstance }: MapUpdaterProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (setMapInstance && map) {
      setMapInstance(map);
    }
  }, [map, setMapInstance]);
  
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
