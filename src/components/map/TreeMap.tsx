
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { latLngToCell, cellToBoundary } from 'h3-js';
import { Camera, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tree } from '@/types/tree';
import MapboxSettings from '@/components/settings/MapboxSettings';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TreeMapProps {
  trees: Tree[];
  onTreeClick: (tree: Tree) => void;
  onCameraClick: () => void;
}

const TreeMap = ({ trees, onTreeClick, onCameraClick }: TreeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Category colors for tree markers
  const categoryColors = {
    farm: '#22c55e',      // Green
    community: '#3b82f6', // Blue
    nursery: '#eab308'    // Yellow
  };

  useEffect(() => {
    // Check for stored Mapbox token
    const token = localStorage.getItem('mapbox_token');
    setMapboxToken(token);
  }, []);

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
    if (!mapContainer.current || !userLocation || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
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
  }, [userLocation, mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => {
      if (!marker.classList.contains('user-location')) {
        marker.remove();
      }
    });

    // Add tree markers
    trees.forEach((tree) => {
      const color = categoryColors[tree.category];
      
      const marker = new mapboxgl.Marker({ color })
        .setLngLat([tree.location.lng, tree.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${tree.name}</h3>
              <p class="text-sm text-gray-600">${tree.scientificName}</p>
              <p class="text-xs text-gray-500">${tree.category} forestry</p>
              <p class="text-xs text-gray-500">H3: ${tree.location.h3Index}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        onTreeClick(tree);
      });
    });
  }, [trees, onTreeClick]);

  if (!mapboxToken) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4 p-8">
          <Settings className="h-16 w-16 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Mapbox Configuration Required</h3>
            <p className="text-muted-foreground mb-4">
              To use the map features, please configure your Mapbox access token.
            </p>
            <Button onClick={() => setShowSettings(true)}>
              Configure Mapbox
            </Button>
          </div>
        </div>

        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Map Configuration</DialogTitle>
            </DialogHeader>
            <MapboxSettings />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

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

      {/* Settings FAB */}
      <Button
        onClick={() => setShowSettings(true)}
        size="sm"
        variant="outline"
        className="fixed top-20 left-4 z-10 rounded-full w-10 h-10 bg-white shadow-lg"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Map Settings</DialogTitle>
          </DialogHeader>
          <MapboxSettings />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreeMap;
