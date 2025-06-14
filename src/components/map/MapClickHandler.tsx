
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

const MapClickHandler = ({ onMapClick }: MapClickHandlerProps) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e: any) => {
      const { lat, lng } = e.latlng;
      console.log('Map clicked at coordinates:', lat, lng);
      onMapClick(lat, lng);
    };

    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

export default MapClickHandler;
