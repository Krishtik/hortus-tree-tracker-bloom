
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { latLngToCell, cellToBoundary } from 'h3-js';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Tree {
  id: string;
  name: string;
  scientificName: string;
  category: 'farm' | 'community' | 'nursery';
  lat: number;
  lng: number;
  h3Index: string;
  photos: string[];
  taggedBy: string;
  taggedAt: Date;
}

interface TreeMapProps {
  trees: Tree[];
  onTreeClick: (tree: Tree) => void;
  onCameraClick: () => void;
}

const TreeMap = ({ trees, onTreeClick, onCameraClick }: TreeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Category colors for tree markers
  const categoryColors = {
    farm: '#22c55e',      // Green
    community: '#3b82f6', // Blue
    nursery: '#eab308'    // Yellow
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a location in India
          setUserLocation([77.2090, 28.6139]); // New Delhi
        }
      );
    } else {
      setUserLocation([77.2090, 28.6139]); // New Delhi fallback
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    // TODO: Replace with actual Mapbox token
    mapboxgl.accessToken = 'your-mapbox-token-here';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: userLocation,
      zoom: 15,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Add user location marker
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<div>Your Location</div>'))
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [userLocation]);

  useEffect(() => {
    if (!map.current) return;

    // Add tree markers
    trees.forEach((tree) => {
      const color = categoryColors[tree.category];
      
      const marker = new mapboxgl.Marker({ color })
        .setLngLat([tree.lng, tree.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${tree.name}</h3>
              <p class="text-sm text-gray-600">${tree.scientificName}</p>
              <p class="text-xs text-gray-500">${tree.category} forestry</p>
              <p class="text-xs text-gray-500">H3: ${tree.h3Index}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        onTreeClick(tree);
      });
    });
  }, [trees, onTreeClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Camera FAB */}
      <Button
        onClick={onCameraClick}
        size="lg"
        className="fixed top-20 right-4 z-10 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
      >
        <Camera className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default TreeMap;
